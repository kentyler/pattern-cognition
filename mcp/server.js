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
    // Create HTTP server for health checks and API endpoints
    this.healthServer = http.createServer(async (req, res) => {
      // Enable CORS for Chrome extension
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      // Health check endpoints
      if (req.url === '/health' || req.url === '/' || req.url === '/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'healthy',
          service: 'conversational-dna-analyzer',
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          uptime: process.uptime()
        }));
        return;
      }

      // API endpoint for Chrome extension
      if (req.url === '/api/analyze' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
          try {
            const { transcript } = JSON.parse(body);
            
            if (!transcript) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Transcript is required' }));
              return;
            }

            console.log('Analyzing transcript for Chrome extension...');
            const analysis = await analyzeConversationTool(transcript);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              analysis: analysis,
              timestamp: new Date().toISOString()
            }));
            
          } catch (error) {
            console.error('Analysis error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              success: false,
              error: error.message 
            }));
          }
        });
        return;
      }

      // API info endpoint
      if (req.url === '/api' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          service: 'Conversational DNA Analyzer',
          version: '1.0.0',
          endpoints: {
            analyze: 'POST /api/analyze',
            health: 'GET /health'
          },
          usage: {
            analyze: {
              method: 'POST',
              body: { transcript: 'Speaker1: Hello\\nSpeaker2: Hi there...' },
              response: { success: true, analysis: '...', timestamp: '...' }
            }
          }
        }));
        return;
      }

      // 404 for unknown endpoints
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Not Found',
        available_endpoints: ['/health', '/api', '/api/analyze']
      }));
    });

    const PORT = process.env.PORT || 10000;
    this.healthServer.listen(PORT, '0.0.0.0', () => {
      console.error(`Server listening on port ${PORT}`);
      console.error(`Health endpoint: http://localhost:${PORT}/health`);
      console.error(`API endpoint: http://localhost:${PORT}/api/analyze`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.error('SIGTERM received, shutting down gracefully...');
      this.healthServer.close(() => {
        console.error('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.error('SIGINT received, shutting down gracefully...');
      this.healthServer.close(() => {
        console.error('Server closed');
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