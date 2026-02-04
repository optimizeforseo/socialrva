"use client";

export default function DebugEnv() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Environment Debug</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">LinkedIn Configuration</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <strong>Client ID:</strong>{" "}
              {process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "❌ Not set"}
            </div>
            <div>
              <strong>Redirect URI:</strong>{" "}
              {process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI || "❌ Not set"}
            </div>
            <div>
              <strong>Current Origin:</strong>{" "}
              {typeof window !== "undefined"
                ? window.location.origin
                : "Server-side"}
            </div>
            <div>
              <strong>Fallback URI:</strong>{" "}
              {typeof window !== "undefined"
                ? `${window.location.origin}/api/auth/linkedin`
                : "N/A"}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Generated OAuth URL</h2>
          <button
            onClick={() => {
              const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
              const redirectUri = encodeURIComponent(
                process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI ||
                  `${window.location.origin}/api/auth/linkedin`
              );
              const scope = encodeURIComponent(
                "openid profile email w_member_social"
              );
              const state = encodeURIComponent("debug-test-" + Date.now());
              const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

              console.log("🔍 Debug OAuth URL:");
              console.log(
                "Raw Redirect URI:",
                process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI ||
                  `${window.location.origin}/api/auth/linkedin`
              );
              console.log("Encoded Redirect URI:", redirectUri);
              console.log("Full URL:", url);

              alert(
                `Check console for debug info!\n\nRedirect URI: ${decodeURIComponent(
                  redirectUri
                )}`
              );
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Generate Debug URL
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click "Generate Debug URL" button above</li>
            <li>Check browser console (F12) for debug info</li>
            <li>Copy the "Raw Redirect URI" value</li>
            <li>Go to LinkedIn Developer Console</li>
            <li>Make sure redirect URI matches exactly</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
