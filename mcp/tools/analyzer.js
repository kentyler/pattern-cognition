// mcp/tools/analyzer.js


import { performConversationAnalysis } from '../../lib/analysisService.js';

export async function analyzeConversationTool(transcript) {
  try {
    console.log('🧬 MCP: Starting conversation analysis...');
    
    const result = await performConversationAnalysis(transcript, {
      filename: 'mcp-conversation.txt',
      source: 'mcp'
    });

    const mcpResponse = `🧬 **CONVERSATIONAL DNA ANALYSIS COMPLETE**

**Session ID**: ${result.sessionId}
**Processing Time**: ${(result.processingTime / 1000).toFixed(1)}s

${result.analysisReport}

---

**💾 Analysis Saved**: This analysis has been stored in your Pattern Intelligence Platform database.
**🔗 Platform Access**: Visit conversationalai.us to track patterns over time and access advanced features.`;

    return mcpResponse;

  } catch (error) {
    console.error('❌ MCP Analysis failed:', error);
    
    return `❌ **Analysis Failed**

Error: ${error.message}

**Next Steps:**
- Check your conversation format
- Try a smaller conversation
- Visit conversationalai.us for manual analysis`;
  }
}