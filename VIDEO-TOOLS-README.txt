Peeyush Tools Hub — Video Editing functional upgrade

Included tools (under the existing Video Editing Studio category):
- Video Editing Studio: trim start/end, speed, rotation, resolution, aspect-ratio crop, filters, grayscale, mute, text overlay, frame PNG, and browser-supported video export/compression.
- Video Merger: merge multiple selected local clips in file-picker order, using browser MediaRecorder/canvas. Audio merging is attempted through Web Audio and may vary by browser/codec.
- Video Thumbnail Maker: seek a frame and export JPG or PNG.
- Existing video editing learning lessons and progress are retained.

All processing is local in the browser; files are not uploaded.

Compatibility notes:
Use an up-to-date Chrome or Edge desktop browser for best support. Output format depends on the browser's MediaRecorder codecs (MP4 may be unavailable; WebM may be offered instead). Long/high-resolution videos may use significant RAM and CPU. The Video Merger currently exports a rendered sequence and is not a full multitrack editor; audio handling depends on browser support.

Installation: replace the matching website files with these files in your GitHub Pages repository. The ZIP contains the website's existing files with pj-tools-video.js updated.
