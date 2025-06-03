// test-analysis.js
import dotenv from 'dotenv';

dotenv.config();

console.log('Environment check:');
console.log('- PATTERN_DB_URL:', process.env.PATTERN_DB_URL ? '✅ Set' : '❌ Missing');
console.log('- ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Missing');
console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
console.log('');

const testConversation = `Alice: I think we should go with option A for the project.
Bob: I'm not sure about that. What if we considered a hybrid approach instead?
Alice: That's interesting. Can you give me more details about what that would look like?
Bob: Well, we could take the best parts of both A and B, maybe starting with A's framework but incorporating B's user interface design.
Alice: I see what you mean. That actually opens up some possibilities I hadn't considered.`;

console.log('Testing analysis service...');

// Add timeout
const timeout = setTimeout(() => {
  console.log('⏰ Test timed out after 60 seconds');
  console.log('💡 Likely stuck on Supabase upload or Claude API call');
  process.exit(1);
}, 60000);

try {
  const { performConversationAnalysis } = await import('./src/lib/analysisService.js');
  
  console.log('📝 Starting analysis...');
  console.log('📊 Text length:', testConversation.length, 'characters');
  
  const result = await performConversationAnalysis(testConversation, {
    filename: 'test-conversation.txt',
    source: 'test'
  });
  
  clearTimeout(timeout);
  
  console.log('✅ Analysis completed successfully!');
  console.log(`📁 Session ID: ${result.sessionId}`);
  console.log(`⏱️  Processing time: ${result.processingTime}ms`);
  console.log(`📄 Analysis length: ${result.analysisReport.length} characters`);
  
} catch (error) {
  clearTimeout(timeout);
  console.error('❌ Analysis failed:', error.message);
  console.error('Stack trace:', error.stack);
}