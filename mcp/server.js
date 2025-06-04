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
import http from 'http';

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
    this.setupHealthCheck();
  }

  setupHealthCheck() {
    // Create HTTP server for health checks (required for Render)
    this.healthServer = http.createServer((req, res) => {
      // Enable CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      if (req.url === '/health' || req.url === '/' || req.url === '/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'healthy',
          service: 'conversational-dna-analyzer',
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          uptime: process.uptime()
        }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Not Found',
          message: 'Health check endpoint available at /health'
        }));
      }
    });

    const PORT = process.env.PORT || 3001;
    this.healthServer.listen(PORT, '0.0.0.0', () => {
      console.error(`Health check server listening on port ${PORT}`);
      console.error(`Health endpoint: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.error('SIGTERM received, shutting down gracefully...');
      this.healthServer.close(() => {
        console.error('Health server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.error('SIGINT received, shutting down gracefully...');
      this.healthServer.close(() => {
        console.error('Health server closed');
        process.exit(0);
      });
    });
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
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      console.error("Conversational DNA MCP Server running on stdio");
      console.error("MCP server ready for connections");
    } catch (error) {
      console.error("Failed to start MCP server:", error);
      process.exit(1);
    }
  }
}

const server = new ConversationalDNAServer();
server.start().catch(console.error);