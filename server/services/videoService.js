const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

class VideoService {
  async mergeVideos(videoPaths, outputPath) {
    return new Promise((resolve, reject) => {
      // Check if FFmpeg is available
      if (!ffmpeg.getFfmpegPath()) {
        reject(new Error('FFmpeg not found. Please install FFmpeg to enable video merging.'));
        return;
      }
      
      // Create output directory if it doesn't exist
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Create FFmpeg command
      const command = ffmpeg();
      
      // Add input videos
      videoPaths.forEach(videoPath => {
        command.input(videoPath);
      });
      
      // Set output format and options
      command
        .on('error', (err) => {
          console.error('FFmpeg Error:', err);
          reject(err);
        })
        .on('end', () => {
          console.log('Video merging completed');
          resolve(outputPath);
        })
        .output(outputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .on('progress', (progress) => {
          console.log(`Processing: ${progress.percent}%`);
        });
      
      // Run command
      command.run();
    });
  }
  
  async generatePreview(videoPath, outputPath, duration = 5) {
    return new Promise((resolve, reject) => {
      // Check if FFmpeg is available
      if (!ffmpeg.getFfmpegPath()) {
        reject(new Error('FFmpeg not found. Please install FFmpeg to enable video preview generation.'));
        return;
      }
      
      // Create output directory if it doesn't exist
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Create FFmpeg command
      ffmpeg(videoPath)
        .on('error', (err) => {
          console.error('FFmpeg Error:', err);
          reject(err);
        })
        .on('end', () => {
          console.log('Video preview generated');
          resolve(outputPath);
        })
        .output(outputPath)
        .setDuration(duration)
        .videoCodec('libx264')
        .audioCodec('aac')
        .on('progress', (progress) => {
          console.log(`Preview processing: ${progress.percent}%`);
        });
      
      // Run command
      ffmpeg.run();
    });
  }
}

module.exports = new VideoService();