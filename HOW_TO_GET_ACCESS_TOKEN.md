# How to Get Your Supabase Access Token

## Steps to Create a Personal Access Token:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Log in to your account

2. **Navigate to Account Settings**
   - Click on your profile/account icon (usually top right)
   - Go to **Account Settings** or **Access Tokens**

3. **Create New Access Token**
   - Look for **"Access Tokens"** or **"Personal Access Tokens"** section
   - Click **"Generate New Token"** or **"Create Token"**
   - Give it a name (e.g., "MCP Server Access")
   - Copy the token immediately (it starts with `sbp_` and won't be shown again)

4. **Update MCP Configuration**
   - Replace `YOUR_ACCESS_TOKEN_HERE` in `C:\Users\Peter.Samir\.cursor\mcp.json` with your actual token
   - The token format should be: `sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Alternative: If you can't find Access Tokens in Account Settings

The access token might be in:
- **Organization Settings** → **Access Tokens**
- **Project Settings** → **API** → **Access Tokens**
- Or you might need to use the **Service Role Key** instead (the one we already have)

## Using Service Role Key Instead

If you prefer to use the Service Role Key we already have, you can modify the config to:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase",
        "--access-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ25ta2hqbXV4aW5xZ2VhcWtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njc3MTE0MywiZXhwIjoyMDgyMzQ3MTQzfQ.sumMJyyegtG-Jr7zUiVEIHu98yR4vnG5Vmtg9fJpK44"
      ]
    }
  }
}
```

## After Updating

1. Restart Cursor to load the new MCP configuration
2. The MCP server should connect automatically
3. You can then use MCP tools to execute SQL and manage your database


