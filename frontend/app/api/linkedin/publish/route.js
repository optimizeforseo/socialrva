import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { content, userId, accessToken, imageUrl } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Mock mode - no real token
    if (!accessToken || accessToken === 'dev_mock_token_not_real') {
      console.log("📝 Mock LinkedIn publish:", { userId, hasImage: !!imageUrl });
      return NextResponse.json({
        success: true,
        postId: "mock_post_" + Date.now(),
        message: "Post published successfully (mock - connect LinkedIn for real posts)",
        mock: true,
      });
    }

    // Get user profile URN
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      return NextResponse.json(
        { error: "Invalid or expired access token. Please re-authenticate." },
        { status: 401 }
      );
    }

    const profile = await profileRes.json();
    const authorUrn = `urn:li:person:${profile.sub}`;

    // Agar image hai toh image ke saath post karo
    if (imageUrl) {
      try {
        // Step 1: Register image upload with LinkedIn
        const registerRes = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0",
          },
          body: JSON.stringify({
            registerUploadRequest: {
              recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
              owner: authorUrn,
              serviceRelationships: [{
                relationshipType: "OWNER",
                identifier: "urn:li:userGeneratedContent",
              }],
            },
          }),
        });

        if (registerRes.ok) {
          const registerData = await registerRes.json();
          const uploadUrl = registerData.value?.uploadMechanism?.["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]?.uploadUrl;
          const assetUrn = registerData.value?.asset;

          if (uploadUrl && assetUrn) {
            // Step 2: Fetch image and upload to LinkedIn
            const imgFetch = await fetch(imageUrl);
            const imgBuffer = await imgFetch.arrayBuffer();

            await fetch(uploadUrl, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "image/png",
              },
              body: imgBuffer,
            });

            // Step 3: Publish post with image
            const publishRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "X-Restli-Protocol-Version": "2.0.0",
              },
              body: JSON.stringify({
                author: authorUrn,
                lifecycleState: "PUBLISHED",
                specificContent: {
                  "com.linkedin.ugc.ShareContent": {
                    shareCommentary: { text: content },
                    shareMediaCategory: "IMAGE",
                    media: [{
                      status: "READY",
                      description: { text: "AI Generated Image" },
                      media: assetUrn,
                      title: { text: "AI Generated Image" },
                    }],
                  },
                },
                visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
              }),
            });

            if (publishRes.ok) {
              const result = await publishRes.json();
              return NextResponse.json({
                success: true,
                postId: result.id,
                message: "Post with image published successfully to LinkedIn",
              });
            }
          }
        }
      } catch (imgErr) {
        console.error("Image upload failed, falling back to text-only post:", imgErr);
      }
    }

    // Text-only post (fallback ya jab image nahi hai)
    const publishRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: content },
            shareMediaCategory: "NONE",
          },
        },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
      }),
    });

    if (!publishRes.ok) {
      const err = await publishRes.json();
      throw new Error(err.message || "LinkedIn publish failed");
    }

    const result = await publishRes.json();
    return NextResponse.json({
      success: true,
      postId: result.id,
      message: "Post published successfully to LinkedIn",
    });

  } catch (error) {
    console.error("LinkedIn publish error:", error);
    if (error.message?.includes("token")) {
      return NextResponse.json(
        { error: "Access token expired. Please re-authenticate with LinkedIn." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to publish to LinkedIn. Please try again." },
      { status: 500 }
    );
  }
}
