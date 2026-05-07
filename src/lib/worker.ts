import { pipeline, env } from '@huggingface/transformers';

// Skip local model check since we are running in the browser and will fetch from HuggingFace
env.allowLocalModels = false;
env.useBrowserCache = true;

let generator: any;

self.addEventListener('message', async (event) => {
  const { type, text } = event.data;

  if (type === 'load') {
    if (!generator) {
      self.postMessage({ status: 'loading', message: 'Downloading offline AI model (this may take a minute on first run)...' });
      try {
        // Use a smaller model for better browser performance
        generator = await pipeline('text-generation', 'Xenova/TinyLlama-1.1B-Chat-v1.0');
        self.postMessage({ status: 'ready' });
      } catch (error) {
        self.postMessage({ status: 'error', error: (error as Error).message });
      }
    } else {
      self.postMessage({ status: 'ready' });
    }
  }

  if (type === 'generate') {
    if (!generator) {
      self.postMessage({ status: 'error', error: 'Model not loaded yet' });
      return;
    }
    
    self.postMessage({ status: 'generating' });
    
    try {
      const prompt = `<|system|>\nYou are a helpful offline health assistant. Keep answers concise.<|user|>\n${text}<|assistant|>\n`;
      
      const output = await generator(prompt, {
        max_new_tokens: 150,
        temperature: 0.7,
      });
      
      const result = output[0].generated_text.split('<|assistant|>\n')[1] || output[0].generated_text;
      
      self.postMessage({ status: 'complete', result: result.trim() });
    } catch (error) {
      self.postMessage({ status: 'error', error: (error as Error).message });
    }
  }
});
