import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "trending";
    const search = searchParams.get("search") || "";
    const minEngagement = parseInt(searchParams.get("minEngagement")) || 0;
    const limit = parseInt(searchParams.get("limit")) || 20;

    // Dynamically import the LinkedIn data service
    const { default: linkedinDataService } = await import(
      "../../services/linkedinDataService"
    );

    let templates;

    if (search) {
      templates = await linkedinDataService.searchViralPosts(search, category);
    } else {
      templates = await linkedinDataService.getViralPosts(category, limit);
    }

    // Apply engagement filter
    if (minEngagement > 0) {
      templates = templates.filter(
        (template) => template.engagement.reactions >= minEngagement
      );
    }

    // Sort by viral score
    templates = templates.sort((a, b) => b.viralScore - a.viralScore);

    return NextResponse.json({
      success: true,
      templates,
      category,
      total: templates.length,
      metadata: {
        searchQuery: search,
        minEngagement,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching viral templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch viral templates" },
      { status: 500 }
    );
  }
}

// POST endpoint to add new viral templates (for admin use)
export async function POST(request) {
  try {
    const template = await request.json();

    // In a real app, you'd save this to your database
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      message: "Template added successfully",
      templateId: Date.now(),
    });
  } catch (error) {
    console.error("Error adding viral template:", error);
    return NextResponse.json(
      { error: "Failed to add viral template" },
      { status: 500 }
    );
  }
}
