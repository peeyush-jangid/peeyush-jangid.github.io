Peeyush Tools Hub — Website + Android App Video Editing Studio integration bundle

Identified uploaded files:
- index(7).html -> portfolio website root index.html
- index(6).html -> Android app page app/index.html
- Archive 2.zip -> shared Peeyush Tools Hub source files

Architecture:
- The portfolio website already links to pj-tools.html.
- The app embeds the same shared Tools Hub via ../pj-tools.html.
- Therefore Video Editing Studio is integrated into the shared Tools Hub so it can appear in both website and app without separate tool copies.

Bundle contents:
- index.html (website homepage, copied from uploaded index(7).html)
- app/index.html (app shell, copied from uploaded index(6).html)
- shared pj-tools*.js/css/html files with Video Editing upgrade

Deployment:
Upload these as an overlay into the existing GitHub repository, keeping the directory structure.
Do not delete other existing files/assets. The homepage/app HTML files are included for reference/replacement, but they are unchanged copies from the user upload. Shared tool source updates are what add Video Editing Studio.

Browser compatibility:
Video export/merge use browser MediaRecorder/canvas/Web Audio. Supported codecs depend on the browser; current browsers commonly export WebM, and MP4 may not be available. Processing runs locally and can be slow for long/high-resolution videos. This bundle is code-validated; full browser end-to-end export testing has not been performed.
