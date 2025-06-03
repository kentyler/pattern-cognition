#!/usr/bin/env node

// Load environment variables from local .env
import dotenv from 'dotenv';
dotenv.config();

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { analyzeConversationTool } from './tools/analyzer.js';

class ConversationalDNAServer {
  constructor() {
    this.server = new Server({
      name: "conversational-dna-analyzer",
      version: "1.0.0"
    }, {
      capabilities: {
        tools: {}
      }
    });

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "analyze_conversation",
          description: "Analyze conversational patterns and extract cognitive DNA from transcript. Provides detailed analysis including cognitive DNA sequences, collaboration dynamics, territorialization patterns, and lines of flight.",
          inputSchema: {
            type: "object",
            properties: {
              transcript: { 
                type: "string", 
                description: "The conversation transcript to analyze. Format as 'Speaker: Message' for each turn." 
              }
            },
            required: ["transcript"]
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case "analyze_conversation":
          return await this.analyzeConversation(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async analyzeConversation(args) {
    const { transcript } = args;

    const analysisResult = await analyzeConversationTool(transcript);

    return {
      content: [
        {
          type: "text",
          text: analysisResult
        }
      ]
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Conversational DNA MCP Server running on stdio");
  }
}

const server = new ConversationalDNAServer();
server.start().catch(console.error);