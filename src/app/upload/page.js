'use client';

// Handle file upload and analysis
const handleAnalysis = useCallback(async (content, sourceFilename = null) => {
  setUploadState('analyzing');
  setProgress(5);
  setError('');
  setFilename(sourceFilename || '');

  // Start progress simulation
  const progressInterval = simulateProgress();

  try {
    // Validate content
    if (!content || content.trim() === '') {
      throw new Error('The content is empty. Please provide conversation text.');
    }

    if (content.length > 100000) {
      throw new Error('Content is too large (over 100,000 characters). Please use a shorter conversation or extract key portions.');
    }

    // Call MCP analysis API directly
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minute timeout

    const response = await fetch('https://pattern-cognition-mcp.onrender.com/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        transcript: content,  // Changed from 'text' to 'transcript'
        filename: sourceFilename 
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    clearInterval(progressInterval);

    if (!response.ok) {
      const errorData = await response.text();
      
      if (response.status === 429) {
        throw new Error('Analysis service is currently at capacity. Please try again in a moment.');
      }
      
      if (response.status === 400) {
        throw new Error('Invalid content format. Please check that your file contains conversation text.');
      }

      throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
    }

    // Get the filename from response headers
    const contentDisposition = response.headers.get('Content-Disposition');
    const downloadFilename = contentDisposition 
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : `conversation-analysis-${new Date().toISOString().slice(0, 10)}.md`;

    // Get the report content
    const reportContent = await response.text();

    // Create and trigger download
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    // Show success
    setProgress(100);
    setFilename(downloadFilename);
    setUploadState('success');

  } catch (err) {
    clearInterval(progressInterval);
    console.error('Analysis failed:', err);
    
    if (err.name === 'AbortError') {
      setError('Analysis timed out. Please try again with a shorter conversation.');
    } else {
      setError(err.message || 'An unexpected error occurred during analysis.');
    }
    
    setUploadState('error');
  }
}, [simulateProgress]);