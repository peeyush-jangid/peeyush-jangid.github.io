/* ===== PJ Pro – data: MS Word & PowerPoint (Beginner → Intermediate → Pro) ===== */
window.PJD = window.PJD || {};
PJD.LV = { B: 'Beginner', I: 'Intermediate', P: 'Pro' };

PJD.word = {
  cmds: [
    ['B', 'Ctrl + N', 'New blank document'], ['B', 'Ctrl + O', 'Open a document'], ['B', 'Ctrl + S', 'Save'], ['B', 'F12', 'Save As (new name / location)'],
    ['B', 'Ctrl + P', 'Print / print preview'], ['B', 'Ctrl + C / X / V', 'Copy / Cut / Paste'], ['B', 'Ctrl + Z / Y', 'Undo / Redo'],
    ['B', 'Ctrl + B / I / U', 'Bold / Italic / Underline'], ['B', 'Ctrl + A', 'Select the whole document'], ['B', 'Ctrl + F', 'Find (Navigation pane)'],
    ['B', 'Ctrl + H', 'Find and Replace'], ['B', 'Ctrl + L / E / R / J', 'Align Left / Center / Right / Justify'], ['B', 'Ctrl + Enter', 'Insert a page break'],
    ['B', 'Ctrl + ] / Ctrl + [', 'Increase / decrease font size'], ['B', 'Ctrl + Home / End', 'Jump to start / end of the document'], ['B', 'Shift + F3', 'Change case (UPPER / lower / Title)'],
    ['B', 'Ctrl + 1 / 5 / 2', 'Line spacing single / 1.5 / double'], ['B', 'F7', 'Spelling and grammar check'], ['B', 'Ctrl + Backspace / Delete', 'Delete the previous / next whole word'],
    ['B', 'Home tab', 'Font, size, colour, bullets, alignment, styles all live here'],
    ['I', 'Ctrl + Alt + 1 / 2 / 3', 'Apply Heading 1 / 2 / 3 style'], ['I', 'Ctrl + Shift + N', 'Reset to Normal style'], ['I', 'Ctrl + Shift + L', 'Bulleted list'],
    ['I', 'Ctrl + Shift + C / V', 'Copy / paste formatting (Format Painter by keys)'], ['I', 'Ctrl + K', 'Insert a hyperlink'], ['I', 'Ctrl + D', 'Open the Font dialog box'],
    ['I', 'Ctrl + Shift + G', 'Word count'], ['I', 'Ctrl + Alt + M', 'Insert a comment'], ['I', 'Ctrl + Shift + E', 'Turn Track Changes on / off'],
    ['I', 'Ctrl + Shift + Spacebar', 'Non-breaking space (keeps "Rs. 500" together)'], ['I', 'Alt + Shift + ← / →', 'Promote / demote a heading level'],
    ['I', 'Insert → Table', 'Insert a table (Tab key adds a new row at the end)'], ['I', 'Insert → Header & Footer', 'Add page numbers, date and title on every page'],
    ['I', 'Layout → Margins / Orientation / Size', 'Page setup for A4, letter, landscape'], ['I', 'Layout → Breaks → Section Break', 'Different layout or header in part of the document'],
    ['I', 'Layout → Columns', 'Newsletter-style columns'], ['I', 'Design → Watermark / Page Borders', 'Draft/confidential watermark, page border'],
    ['I', 'Home → Styles', 'Use Heading / Title / Normal styles instead of manual formatting'], ['I', 'Home → Sort (A→Z)', 'Sort a list or table column'],
    ['I', 'Table Layout → Merge Cells / Repeat Header Rows', 'Merge cells; repeat the header on every page'],
    ['P', 'References → Table of Contents', 'Auto TOC from Heading styles (right-click → Update Field)'], ['P', 'F9', 'Update selected fields (TOC, page number, cross-reference)'],
    ['P', 'Alt + F9', 'Show / hide field codes'], ['P', 'Ctrl + F9', 'Insert an empty field {  }'], ['P', 'Ctrl + Alt + F / D', 'Insert footnote / endnote'],
    ['P', 'References → Insert Caption + Cross-reference', 'Auto-numbered Figure / Table captions that update'], ['P', 'References → Citations & Bibliography', 'APA / MLA / Chicago references'],
    ['P', 'Mailings → Start Mail Merge', 'Letters, labels, certificates from an Excel list'], ['P', 'Mailings → Insert Merge Field / Preview Results / Finish & Merge', 'Personalise each copy'],
    ['P', 'Review → Compare / Combine', 'See differences between two versions'], ['P', 'Review → Restrict Editing / Protect', 'Password or limit editing to forms / comments'],
    ['P', 'Developer → Content Controls', 'Fillable forms: text box, drop-down, date picker, checkbox'], ['P', 'Alt + F8 / Alt + F11', 'Macros list / VBA editor – automate repeated work'],
    ['P', 'Ctrl + H → More → Special: ^p ^t ^w', 'Find paragraph marks, tabs, white space; Use Wildcards for patterns'], ['P', 'F4 or Ctrl + Y', 'Repeat the last action (great for formatting many places)'],
    ['P', 'Alt + =', 'Insert an equation'], ['P', 'Design → Themes / Define New Style → Save as .dotx', 'Reusable company template'],
    ['P', 'Insert → Index (Mark Entry Alt+Shift+X)', 'Back-of-book index'], ['P', 'View → Navigation Pane / Outline view', 'Reorder whole chapters by dragging headings'],
    ['P', 'File → Info → Check for Issues → Accessibility / Inspect Document', 'Remove hidden data, check accessibility'], ['P', 'File → Export → Create PDF/XPS', 'Share a locked-layout PDF']
  ],
  lessons: {
    B: [
      ['Create, type and save', ['Open Word → Blank document.', 'Type your text. Press Enter only at the end of a paragraph, not at the end of every line.', 'Press Ctrl+S → choose a folder → give a clear file name → Save.', 'Use Ctrl+Z if you make a mistake.']],
      ['Format text', ['Select the text (double-click a word, triple-click a paragraph).', 'Home tab → choose Font, Size, Bold, Italic, Colour.', 'Use Ctrl+E to centre a title and Ctrl+J to justify paragraphs.']],
      ['Bullets and numbering', ['Select the lines → Home → Bullets or Numbering.', 'Press Tab to make a sub-point, Shift+Tab to go back.', 'Press Enter twice to finish the list.']],
      ['Insert table and picture', ['Insert → Table → drag to choose rows and columns.', 'Insert → Pictures → choose a file. Click the picture → Wrap Text → In Line with Text for easy placing.', 'Use Table Design to apply a ready table style.']],
      ['Page setup and print', ['Layout → Margins → Normal; Size → A4.', 'Insert → Page Number → Bottom of Page.', 'Ctrl+P to preview, choose the printer and pages, then Print – or Save as PDF.']]
    ],
    I: [
      ['Use Styles, not manual formatting', ['Type a title → Home → Styles → Title. Chapter names → Heading 1, sub-topics → Heading 2.', 'Right-click a style → Modify to change font/colour for the whole document at once.', 'Open View → Navigation Pane to see your outline.']],
      ['Header, footer and sections', ['Insert → Header → Edit Header. Add company name; use Different First Page for a cover.', 'Layout → Breaks → Next Page to start a new section.', 'Unlink "Link to Previous" to give each section its own header, or a landscape page.']],
      ['Tables that look professional', ['Insert → Table. Select the table → Layout → AutoFit → AutoFit Window.', 'Select header row → Layout → Repeat Header Rows.', 'Home → Shading for header colour; Borders → All Borders.', 'Use Layout → Formula (e.g. =SUM(ABOVE)) for totals.']],
      ['Review: comments and track changes', ['Review → Track Changes (Ctrl+Shift+E) before editing someone else’s file.', 'Add comments with Ctrl+Alt+M.', 'Accept or Reject each change from the Review tab; Reviewing Pane lists everything.']],
      ['Images, shapes and layout', ['Insert → Shapes / SmartArt for simple diagrams.', 'Picture Format → Wrap Text → Square or Tight to flow text around a picture.', 'Layout → Align to keep objects tidy; Group them with Ctrl+click → Group.']]
    ],
    P: [
      ['Automatic Table of Contents', ['Apply Heading 1/2/3 consistently.', 'References → Table of Contents → pick a style.', 'After edits, right-click the TOC → Update Field → Update entire table (or press F9).']],
      ['Mail Merge – 100 certificates in 2 minutes', ['Keep names in Excel with column headers (Name, Course, Date).', 'Word: Mailings → Start Mail Merge → Letters → Select Recipients → Use an Existing List.', 'Insert Merge Field for each blank → Preview Results → Finish & Merge → Edit Individual Documents or Print.']],
      ['Captions, cross-references and citations', ['Right-click a picture → Insert Caption (Figure 1).', 'Insert → Cross-reference to link to "Figure 1" in the text; it updates automatically.', 'References → Style: APA → Insert Citation → Bibliography.']],
      ['Build a company template and fillable form', ['Set styles, colours, header/footer and logo.', 'File → Save As → Word Template (*.dotx).', 'Developer tab → Content Controls (text, drop-down, date) → Restrict Editing → Filling in forms.']],
      ['Automate with Find & Replace and Macros', ['Ctrl+H → More → Special → ^p^p replaced by ^p to remove empty lines.', 'Use Wildcards to format all numbers or all dates in one go.', 'View → Macros → Record Macro for steps you repeat daily; run with a shortcut button.']]
    ]
  },
  qa: [
    ['What is the difference between Save and Save As?', 'Save (Ctrl+S) updates the current file. Save As (F12) creates a copy with a new name, location or format such as PDF or DOCX.'],
    ['How do you make a Table of Contents automatically?', 'Apply Heading 1/2/3 styles to titles, then References → Table of Contents. Press F9 or Update Field after any change.'],
    ['What is Mail Merge and where have you used it?', 'It combines one Word template with an Excel list to make personalised letters, labels, certificates or invoices. Use Mailings → Start Mail Merge → Select Recipients → Insert Merge Field → Finish & Merge.'],
    ['Difference between a Page Break and a Section Break?', 'A page break only starts a new page. A section break lets that part have its own header/footer, page numbering, orientation or columns.'],
    ['How do you keep the header row of a long table on every page?', 'Click the first row → Table Layout → Repeat Header Rows.'],
    ['What are Styles and why use them?', 'Saved formatting sets (Heading 1, Normal). They keep the document consistent, power the TOC/Navigation pane and let you change the whole look in one place.'],
    ['How do you compare two versions of a document?', 'Review → Compare → select original and revised. Word shows the differences as tracked changes.'],
    ['How can you protect a Word file?', 'File → Info → Protect Document → Encrypt with Password, or Restrict Editing to allow only comments or form filling.'],
    ['What is Format Painter?', 'Copies formatting from one text to another. Single click for one use, double-click to paint many places; or use Ctrl+Shift+C / V.'],
    ['How do you remove all extra empty paragraphs quickly?', 'Ctrl+H → More → Special → Paragraph Mark in Find (^p^p) and one ^p in Replace → Replace All (repeat until none left).'],
    ['What is a macro?', 'A recorded or VBA-coded set of actions that runs with one click. Record it from View → Macros; save the file as .docm.'],
    ['How do you make page numbers start from page 3?', 'Insert a section break after page 2, unlink the footer from the previous section, then Page Number → Format Page Numbers → Start at 1.']
  ],
  mcq: [
    ['B', 'Which shortcut saves a document?', ['Ctrl+P', 'Ctrl+S', 'Ctrl+O', 'Ctrl+N'], 1, 'Ctrl+S = Save.'],
    ['B', 'Ctrl+E does what?', ['Right align', 'Justify', 'Centre align', 'Select all'], 2, 'Ctrl+E centres the paragraph.'],
    ['B', 'Which key combination inserts a page break?', ['Ctrl+Enter', 'Shift+Enter', 'Alt+Enter', 'Ctrl+B'], 0, 'Ctrl+Enter starts a new page.'],
    ['B', 'Ctrl+H opens…', ['Help', 'Header', 'Find and Replace', 'History'], 2, 'Ctrl+H = Replace dialog.'],
    ['B', 'Shift+F3 is used to…', ['Change text case', 'Insert table', 'Open Save As', 'Print'], 0, 'It cycles UPPERCASE → lowercase → Title Case.'],
    ['B', 'Which key opens Save As?', ['F2', 'F7', 'F12', 'F5'], 2, 'F12 = Save As.'],
    ['B', 'Ctrl+J applies which alignment?', ['Left', 'Justify', 'Centre', 'Right'], 1, 'Ctrl+J = Justify.'],
    ['B', 'Which shortcut selects the whole document?', ['Ctrl+A', 'Ctrl+D', 'Ctrl+W', 'Ctrl+L'], 0, 'Ctrl+A = Select All.'],
    ['B', 'F7 runs the…', ['Thesaurus', 'Spelling and Grammar check', 'Word Count', 'Print Preview'], 1, 'F7 = Spelling & Grammar.'],
    ['B', 'Ctrl+5 sets line spacing to…', ['Single', 'Double', '1.5 lines', '3 lines'], 2, 'Ctrl+1 single, Ctrl+5 1.5, Ctrl+2 double.'],
    ['I', 'Ctrl+Alt+1 applies…', ['Heading 1', 'Bold', 'Title', 'Footnote'], 0, 'Ctrl+Alt+1/2/3 apply Heading 1/2/3.'],
    ['I', 'Format Painter copies…', ['Only text', 'Only pictures', 'Formatting', 'Tables only'], 2, 'It copies formatting from one place to another.'],
    ['I', 'Which shortcut toggles Track Changes?', ['Ctrl+Shift+E', 'Ctrl+Alt+T', 'Ctrl+T', 'Alt+F3'], 0, 'Ctrl+Shift+E.'],
    ['I', 'Ctrl+Shift+G opens…', ['Grammar check', 'Word Count', 'Go To', 'Group'], 1, 'Ctrl+Shift+G shows words, characters, pages.'],
    ['I', 'To give one part of a document a landscape page you need a…', ['Page break', 'Column break', 'Section break', 'Text box'], 2, 'Section breaks allow different page setup.'],
    ['I', 'Ctrl+Shift+L creates a…', ['Bulleted list', 'Table', 'Hyperlink', 'Left align'], 0, 'Applies the List Bullet style.'],
    ['I', 'Ctrl+K inserts a…', ['Comment', 'Hyperlink', 'Table', 'Symbol'], 1, 'Ctrl+K = Insert Hyperlink.'],
    ['I', 'Ctrl+Shift+Spacebar inserts a…', ['Tab', 'Non-breaking space', 'Page break', 'Line break'], 1, 'It stops two words from separating at line end.'],
    ['I', 'Where do you add page numbers?', ['Home → Font', 'Insert → Page Number', 'Review → Comments', 'View → Zoom'], 1, 'Insert → Page Number.'],
    ['I', 'Why use Heading styles?', ['Only for colour', 'They enable TOC and Navigation Pane', 'They make file smaller', 'To lock the file'], 1, 'Styles give structure that Word can use for TOC and navigation.'],
    ['P', 'F9 in Word…', ['Updates selected fields', 'Opens VBA', 'Prints', 'Closes file'], 0, 'F9 updates fields like TOC and page numbers.'],
    ['P', 'Alt+F9 does what?', ['Shows/hides field codes', 'Saves macro', 'Opens Mail Merge', 'Inserts footnote'], 0, 'Toggles field codes.'],
    ['P', 'Mail Merge needs…', ['Only a printer', 'A main document and a data source', 'A PDF file', 'Track Changes'], 1, 'Main document (letter) + data (Excel/Outlook list).'],
    ['P', 'Alt+F11 opens…', ['VBA editor', 'Navigation pane', 'Review pane', 'Styles pane'], 0, 'The Visual Basic editor for macros.'],
    ['P', 'Ctrl+Alt+F inserts a…', ['Footnote', 'Endnote', 'Field', 'Frame'], 0, 'Ctrl+Alt+D inserts an endnote.'],
    ['P', 'In Find & Replace, ^p stands for…', ['Page', 'Paragraph mark', 'Picture', 'Print'], 1, '^p = paragraph mark, ^t = tab.'],
    ['P', 'Which tab holds Content Controls for forms?', ['Review', 'Developer', 'Mailings', 'View'], 1, 'Developer tab (enable it in Options → Customize Ribbon).'],
    ['P', 'Best way to number figures so they update automatically?', ['Type numbers manually', 'Insert Caption + Cross-reference', 'Use bullets', 'Use a text box'], 1, 'Captions are fields that renumber automatically.'],
    ['P', 'A reusable company letterhead should be saved as…', ['.docx', '.dotx', '.pdf', '.txt'], 1, '.dotx is a Word template.'],
    ['P', 'F4 (or Ctrl+Y) is used to…', ['Repeat the last action', 'Open Save As', 'Check spelling', 'Close file'], 0, 'Great for repeating formatting.']
  ],
  sheet: {
    B: ['Type a 5-line paragraph about yourself. Make the title bold, 16 pt, centred.', 'Change the paragraph to Justify, line spacing 1.5, font Calibri 12.', 'Make a bulleted list of your 5 skills and a numbered list of your 3 goals.', 'Insert a 4×3 table (Subject, Marks, Grade) and fill 3 rows.', 'Insert page numbers at the bottom centre and save as "practice1.docx".', 'Use Find & Replace to change every "good" into "excellent". Then export the file as PDF.'],
    I: ['Create a 2-page report with Title, 3 Heading 1 and 2 Heading 2 using Styles only.', 'Add a header with your name and a footer with page numbers (start with "Page 1 of N").', 'Make a cover page with "Different First Page" so the header does not show on it.', 'Insert a table of 6 rows; repeat the header row; shade the header; add a SUM total with Layout → Formula.', 'Insert a picture, wrap text Square, add a caption below it.', 'Turn on Track Changes, edit 3 sentences, add 2 comments, then accept all changes.'],
    P: ['Create a 10-page dummy document with Heading 1/2 and auto Table of Contents; add a new heading and update the TOC.', 'Add 3 figures with captions and cross-references in the text; then insert a new figure at the start and see numbers update.', 'Make a Mail Merge certificate: Excel list of 5 names → Word template → Finish & Merge to a new document.', 'Create a fillable leave application form using Content Controls (name, date picker, drop-down for leave type); restrict editing.', 'Record a macro that formats selected text as Arial 11 bold dark blue; assign it to a Quick Access button.', 'Use Find & Replace with ^p to remove all double empty lines, and with Wildcards to bold every number in a pasted report.']
  }
};

PJD.ppt = {
  cmds: [
    ['B', 'Ctrl + N', 'New presentation'], ['B', 'Ctrl + M', 'Insert a new slide'], ['B', 'Ctrl + S', 'Save'], ['B', 'F12', 'Save As'],
    ['B', 'F5', 'Start slide show from the first slide'], ['B', 'Shift + F5', 'Start slide show from the current slide'], ['B', 'Esc', 'End the slide show'],
    ['B', 'Ctrl + D', 'Duplicate selected slide / object'], ['B', 'Ctrl + B / I / U', 'Bold / Italic / Underline'], ['B', 'Ctrl + E / L / R', 'Centre / Left / Right align'],
    ['B', 'Ctrl + C / X / V', 'Copy / Cut / Paste'], ['B', 'Ctrl + Z / Y', 'Undo / Redo'], ['B', 'Ctrl + A', 'Select all objects / slides'], ['B', 'Delete', 'Delete the selected slide or object'],
    ['B', 'Ctrl + P', 'Print'], ['B', 'Ctrl + T', 'Font dialog (Text)'], ['B', 'Home → Layout', 'Title, Title+Content, Two Content, Blank layouts'],
    ['B', 'During show: N / P or → / ←', 'Next / previous slide'], ['B', 'During show: B / W', 'Black screen / white screen (press again to return)'], ['B', 'During show: number + Enter', 'Jump directly to a slide number'],
    ['B', 'During show: Ctrl + P', 'Pen pointer – draw while presenting (Ctrl+A returns to arrow)'],
    ['I', 'View → Slide Master', 'Change fonts, logo and layouts for all slides at once'], ['I', 'Design → Themes / Variants', 'Apply a consistent colour & font theme'],
    ['I', 'Transitions tab', 'Effects between slides (Fade, Push); keep one style throughout'], ['I', 'Animations → Animation Pane', 'Order, timing and delay of every object animation'],
    ['I', 'Alt + F10', 'Open the Selection Pane (hide / rename / reorder objects)'], ['I', 'Ctrl + G / Ctrl + Shift + G', 'Group / Ungroup objects'], ['I', 'Ctrl + Shift + C / V', 'Copy / paste formatting'],
    ['I', 'Shape Format → Align / Distribute', 'Perfectly align and space objects'], ['I', 'Shift + drag a corner', 'Resize while keeping proportion'], ['I', 'Ctrl + drag', 'Copy an object by dragging it'],
    ['I', 'Insert → SmartArt / Chart / Table', 'Turn text into diagrams, graphs and tables'], ['I', 'Picture Format → Crop / Remove Background', 'Edit images inside PowerPoint'], ['I', 'Ctrl + K', 'Insert a hyperlink / link to another slide'],
    ['I', 'Home → Section', 'Group slides into named sections'], ['I', 'Slide Show → Rehearse Timings', 'Record time per slide'], ['I', 'Alt + F5', 'Presenter view (notes + timer)'],
    ['I', 'View → Notes', 'Write speaker notes under each slide'], ['I', 'File → Export → PDF / Handouts', 'Share a PDF or print handouts'],
    ['P', 'Transitions → Morph', 'Smooth object movement between two slides (duplicate slide, move objects)'], ['P', 'Insert → Zoom', 'Summary / Section / Slide Zoom – non-linear navigation'],
    ['P', 'Animations → Trigger', 'Start an animation when a certain object is clicked'], ['P', 'Animations → Motion Paths', 'Move an object along a custom path'],
    ['P', 'Animations → Animation Painter', 'Copy animation from one object to another'], ['P', 'Shape Format → Merge Shapes (Union / Combine / Fragment / Intersect / Subtract)', 'Make custom icons and shapes'],
    ['P', 'Right-click shape → Edit Points', 'Reshape any shape point by point'], ['P', 'Shape Fill → Eyedropper', 'Pick any colour on the screen (logo colours)'],
    ['P', 'Slide Master → Insert Layout / Placeholder', 'Build your own layouts for a company template'], ['P', 'Slide Show → Custom Slide Show', 'Different audience, different slide selection from one file'],
    ['P', 'Slide Show → Record Slide Show', 'Record narration, laser pointer and timings'], ['P', 'File → Export → Create a Video', 'Make an MP4 from your deck'],
    ['P', 'Design → Slide Size → Custom', 'Poster, social media, 4:3 or 16:9 sizes'], ['P', 'Insert → Object / Paste Special → Linked Excel chart', 'Charts that update from Excel'],
    ['P', 'Compress Pictures (Picture Format)', 'Reduce file size for email'], ['P', 'Review → Check Accessibility', 'Alt-text, reading order and contrast check'],
    ['P', 'Alt + F8 / Alt + F11', 'Macros / VBA editor for bulk edits'], ['P', 'Design → Designer (Design Ideas)', 'AI layout suggestions for selected content']
  ],
  lessons: {
    B: [
      ['First presentation', ['Open PowerPoint → Blank Presentation.', 'Type the title and subtitle on slide 1.', 'Press Ctrl+M for new slides. Choose Home → Layout: Title and Content.', 'Save with Ctrl+S.']],
      ['Text and design rules', ['Maximum 5–6 lines per slide, minimum 24 pt font.', 'Use one theme: Design → Themes.', 'Dark text on light background (or the reverse); never red on green.']],
      ['Pictures, shapes, tables', ['Insert → Pictures → This Device.', 'Insert → Shapes for arrows and boxes; hold Shift for perfect circle/square.', 'Insert → Table for comparisons.']],
      ['Transitions and animations (basic)', ['Transitions → choose Fade → Apply to All.', 'Select a text box → Animations → Appear/Fade → set Start: On Click.']],
      ['Present it', ['Press F5 to start. Use arrow keys. Press B for black screen.', 'Press Esc to end.', 'Export: File → Export → PDF.']]
    ],
    I: [
      ['Slide Master – design once, apply everywhere', ['View → Slide Master → choose the top master slide.', 'Set the title font, colours and place the company logo.', 'Close Master View – all slides follow it.']],
      ['SmartArt and charts', ['Select your bullet list → Home → Convert to SmartArt.', 'Insert → Chart → choose column/line/pie → edit data in the small Excel window.', 'Use Chart Design → Quick Layout to remove clutter.']],
      ['Animation Pane and timing', ['Animations → Animation Pane. Drag items to reorder.', 'Set Start: After Previous with a 0.5 s delay for a flow.', 'Avoid more than 2 animation styles in one deck.']],
      ['Sections, notes and presenter view', ['Right-click between slides → Add Section.', 'Write notes in View → Notes.', 'Alt+F5 shows slide + notes + timer on your screen, audience sees only the slide.']],
      ['Alignment and professional look', ['Select objects → Shape Format → Align → Distribute Horizontally.', 'View → Guides to keep margins.', 'Use Format Painter (double-click) for matching styles.']]
    ],
    P: [
      ['Morph transition – cinematic slides', ['Create a slide with an object. Ctrl+D to duplicate the slide.', 'On slide 2 move, resize or recolour the object.', 'Transitions → Morph. Press F5 to see smooth movement.']],
      ['Zoom – navigate like a website', ['Insert → Zoom → Summary Zoom → pick sections.', 'A menu slide is created; each tile jumps to its section and returns.', 'Great for long training decks.']],
      ['Interactive quiz with triggers', ['Add 4 answer boxes. Add a "Correct!" text with Entrance animation.', 'Animations → Trigger → On Click of → Answer B.', 'Press F5 to test.']],
      ['Build your own template', ['View → Slide Master → Insert Layout → add placeholders (title, picture, text).', 'Set theme colours and fonts: Design → Variants → Colors / Fonts → Customize.', 'File → Save As → PowerPoint Template (*.potx).']],
      ['Storytelling and delivery', ['Use the 10-20-30 idea: about 10 slides, 20 minutes, 30 pt font.', 'One message per slide; the title should be the conclusion ("Sales grew 18%"), not a label.', 'Start with the problem, then the solution, then the proof, then the action.']]
    ]
  },
  qa: [
    ['What is a Slide Master?', 'The top slide that controls fonts, colours, logo and layouts for every slide. Edit it once to update the whole deck (View → Slide Master).'],
    ['Difference between Transition and Animation?', 'A transition is the effect when moving from one slide to the next. An animation is the movement of objects inside a slide.'],
    ['How do you present with notes while the audience sees only slides?', 'Use Presenter View (Alt+F5) with two screens or Slide Show → Use Presenter View.'],
    ['What is the Morph transition?', 'It animates differences between two slides automatically – size, position, colour or text change – for smooth motion without manual animation.'],
    ['What are Sections used for?', 'To group slides into parts so you can collapse, reorder, or apply a transition to a whole group; also the base of Section Zoom.'],
    ['How do you reduce the file size of a PowerPoint?', 'Compress Pictures, delete cropped areas, avoid embedded video (link it), and remove unused layouts.'],
    ['What is the 10-20-30 rule?', 'Guy Kawasaki’s guideline: 10 slides, 20 minutes, 30 pt minimum font.'],
    ['How do you make slides accessible?', 'Add alt-text, use sufficient contrast, set reading order in the Selection Pane and run Review → Check Accessibility.'],
    ['How can the same deck be shown to two audiences?', 'Use Custom Slide Show: pick the slides for each audience and present the chosen show.'],
    ['What is Merge Shapes?', 'It combines, subtracts or intersects shapes to create custom icons and logos (Shape Format → Merge Shapes).'],
    ['How do you link an Excel chart so it updates?', 'Copy the chart in Excel → in PowerPoint Paste Special → Paste Link (Keep Source Formatting).'],
    ['How do you make a video or PDF of a presentation?', 'File → Export → Create a Video (MP4) or Create PDF/XPS. Use Rehearse Timings first for auto-advance.']
  ],
  mcq: [
    ['B', 'Which shortcut inserts a new slide?', ['Ctrl+N', 'Ctrl+M', 'Ctrl+D', 'Ctrl+S'], 1, 'Ctrl+M = New Slide (Ctrl+N is a new presentation).'],
    ['B', 'F5 starts the slide show…', ['From the current slide', 'From the beginning', 'From the end', 'In Notes view'], 1, 'Shift+F5 starts from the current slide.'],
    ['B', 'Which key ends the slide show?', ['Esc', 'Enter', 'Tab', 'Ctrl+Q'], 0, 'Esc exits the show.'],
    ['B', 'Pressing B during a show gives…', ['Bold', 'Black screen', 'Back one slide', 'Blue pen'], 1, 'B = black screen, W = white screen.'],
    ['B', 'Ctrl+D on a selected slide…', ['Deletes it', 'Duplicates it', 'Draws a shape', 'Opens design'], 1, 'Ctrl+D duplicates the slide or object.'],
    ['B', 'Ctrl+G does what?', ['Groups objects', 'Goes to slide', 'Guides on', 'Grid lines'], 0, 'Ctrl+G group, Ctrl+Shift+G ungroup.'],
    ['B', 'Best minimum font size for slides is about…', ['10 pt', '14 pt', '24 pt', '8 pt'], 2, 'Large text is readable from the back of a room.'],
    ['B', 'To jump to slide 7 during the show press…', ['7 then Enter', 'Ctrl+7', 'F7', 'Alt+7'], 0, 'Type the number then Enter.'],
    ['B', 'Which tab has Fade and Push effects between slides?', ['Animations', 'Transitions', 'Design', 'Insert'], 1, 'Transitions tab.'],
    ['B', 'Ctrl+P during a slide show gives…', ['Print', 'Pen pointer', 'Play video', 'Pause'], 1, 'It turns the mouse into a pen.'],
    ['I', 'Slide Master is used to…', ['Edit one slide', 'Control all slides’ design', 'Record audio', 'Print notes'], 1, 'It sets a deck-wide design.'],
    ['I', 'Alt+F10 opens the…', ['Selection Pane', 'Notes', 'Ruler', 'Macros'], 0, 'Useful to reorder or hide objects.'],
    ['I', 'Presenter View shortcut is…', ['Alt+F5', 'Ctrl+F5', 'Shift+F10', 'F1'], 0, 'Alt+F5 starts Presenter View.'],
    ['I', 'Where do you control object animation order?', ['Animation Pane', 'Slide Master', 'Notes', 'Handout Master'], 0, 'Animations → Animation Pane.'],
    ['I', 'Ctrl+Shift+C / V is for…', ['Copy/paste formatting', 'Copy/paste slides', 'Compare/verify', 'Cut/view'], 0, 'Like Format Painter.'],
    ['I', 'Sections in PowerPoint help to…', ['Lock slides', 'Group slides into parts', 'Add music', 'Change theme'], 1, 'Right-click between slides → Add Section.'],
    ['I', 'Rehearse Timings records…', ['Time for each slide', 'Voice only', 'Video', 'Slide size'], 0, 'Useful for auto-running decks.'],
    ['I', 'SmartArt is best for…', ['Photos', 'Turning text into diagrams', 'Audio', 'Printing'], 1, 'E.g. process, hierarchy, cycle.'],
    ['I', 'Which keeps an image proportional while resizing?', ['Hold Shift on corner', 'Hold Alt on side', 'Press Tab', 'Press F4'], 0, 'Shift (or Ctrl+Shift for centre) + corner handle.'],
    ['I', 'To change the logo on every slide edit the…', ['Notes page', 'Slide Master', 'Handout', 'Each slide'], 1, 'Master propagates to all layouts.'],
    ['P', 'Morph transition needs…', ['Two slides with matching objects', 'Only one slide', 'A video file', 'Macros'], 0, 'Duplicate a slide and change object position/size.'],
    ['P', 'Summary Zoom is found in…', ['Insert → Zoom', 'Review', 'View', 'Design'], 0, 'Insert → Zoom → Summary Zoom.'],
    ['P', 'A Trigger starts an animation when…', ['A set object is clicked', 'File opens', 'Slide is deleted', 'Timer ends only'], 0, 'Used for interactive quizzes and pop-ups.'],
    ['P', 'Merge Shapes → Subtract is used to…', ['Cut a shape out of another', 'Add music', 'Compress file', 'Change theme'], 0, 'Makes custom icons.'],
    ['P', 'A reusable PowerPoint design is saved as…', ['.pptx', '.potx', '.pdf', '.mp4'], 1, '.potx = template.'],
    ['P', 'Animation Painter copies…', ['Animation effects', 'Fonts', 'Slides', 'Sound'], 0, 'Like Format Painter for animation.'],
    ['P', 'To make a video from a deck use…', ['File → Export → Create a Video', 'Design → Video', 'Insert → Screen', 'Review → Video'], 0, 'Exports MP4/WMV.'],
    ['P', 'Linked Excel charts are inserted using…', ['Paste Special → Paste Link', 'Print', 'Alt+F4', 'Insert → Header'], 0, 'The chart updates when Excel data changes.'],
    ['P', 'Edit Points is used to…', ['Reshape a shape node by node', 'Edit slide numbers', 'Change theme', 'Add alt text'], 0, 'Right-click shape → Edit Points.'],
    ['P', 'A good slide title should be…', ['A single word label', 'The key message/conclusion', 'Always in capitals', 'Hidden'], 1, 'Action titles ("Sales rose 18%") tell the audience the point.']
  ],
  sheet: {
    B: ['Create a 5-slide presentation "About Me" using Title, Title+Content layouts.', 'Apply one theme from Design and change the variant colours.', 'Insert 1 picture, 1 shape with text and a 3×3 table on different slides.', 'Apply Fade transition to all slides and "Fade" entrance to the bullets of slide 2.', 'Start the show from slide 3 (Shift+F5), use B and W keys, then end with Esc.', 'Save as .pptx and export as PDF.'],
    I: ['Edit the Slide Master: add a logo, change title font to 32 pt bold and set theme colours.', 'Convert a 5-line bullet list into a SmartArt process.', 'Insert a column chart from data (Q1–Q4) and add data labels.', 'Add 3 sections and write speaker notes for each slide.', 'Align and distribute 6 shapes equally; group them; rename in the Selection Pane.', 'Rehearse Timings and run the deck in Presenter View.'],
    P: ['Make a 3-slide product reveal using the Morph transition.', 'Create a menu slide with Summary Zoom linking to 3 sections.', 'Build a 4-question quiz with Triggers (correct → green tick, wrong → red cross).', 'Design a custom layout in Slide Master and save the deck as .potx.', 'Use Merge Shapes to create a custom icon (e.g. location pin) and recolour it using Eyedropper.', 'Export the final deck as a video with narration and timings.']
  }
};
