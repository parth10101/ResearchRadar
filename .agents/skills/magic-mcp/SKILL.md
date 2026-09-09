---
name: magic-mcp
description: >-
  21st.dev Magic MCP integration guide. Connects AI agents to component libraries,
  design inspirations, and automated UI context processing.
---

# 21st.dev Magic MCP Integration

Integrates ResearchRadar with 21st.dev component generation and UI inspiration tools.

## Configuration

Add the 21st HTTP MCP server to your `mcp_config.json`:

```json
{
  "mcpServers": {
    "21st": {
      "url": "https://21st.dev/api/mcp",
      "headers": {
        "x-api-key": "${API_KEY_21ST}"
      }
    }
  }
}
```

## Available Toolset
- `generate`: Synthesizes production-ready React/Tailwind components from prompt descriptions.
- `get_inspiration`: Retrieves curated design patterns, themes, and layouts from the 21st.dev registry.
- `search_logo`: Retrieves authentic SVG logos for technology stacks and partner integrations.
