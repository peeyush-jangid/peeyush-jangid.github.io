/* ===== MS Word & MS PowerPoint learning tools (commands Beginner→Pro, interview Q&A, practice test, practice sheet) ===== */
(function () {
  if (!window.PJ || !PJ.learnTool) return;

  /* ====================== MS WORD ====================== */
  const WORD_CMDS = PJ.rows(`
B|Ctrl+N|Create a new blank document
B|Ctrl+O|Open an existing document
B|Ctrl+S|Save the document (press often!)
B|F12|Save As – new name, folder or format (PDF, DOCX)
B|Ctrl+P|Print / print preview
B|Ctrl+W|Close the current document
B|Ctrl+C|Copy selected text
B|Ctrl+X|Cut selected text
B|Ctrl+V|Paste
B|Ctrl+Z|Undo last action
B|Ctrl+Y|Redo / repeat last action (also F4)
B|Ctrl+A|Select the whole document
B|Ctrl+B|Bold
B|Ctrl+I|Italic
B|Ctrl+U|Underline
B|Ctrl+L|Align left
B|Ctrl+E|Align centre
B|Ctrl+R|Align right
B|Ctrl+J|Justify text
B|Ctrl+F|Find text (opens Navigation pane)
B|Ctrl+H|Find and Replace
B|Ctrl+Enter|Insert a page break
B|Ctrl+Home|Go to the start of the document
B|Ctrl+End|Go to the end of the document
B|Ctrl+]|Increase font size by 1 pt
B|Ctrl+[|Decrease font size by 1 pt
B|Ctrl+K|Insert a hyperlink
B|Shift+F3|Cycle case: lower / UPPER / Title Case
B|F7|Run Spelling & Grammar check
B|Ctrl+Backspace|Delete the previous word
B|Home > Bullets|Create a bulleted list
B|Home > Numbering|Create a numbered list
B|Home > Line Spacing|Set 1.0 / 1.15 / 1.5 / 2.0 spacing
B|Home > Format Painter|Copy formatting from one text to another (double-click to apply many times)
B|Insert > Table|Insert a table by selecting rows and columns
B|Insert > Picture|Insert an image from your computer
B|Insert > Page Number|Add page numbers in header or footer
B|Layout > Margins|Choose Normal / Narrow / Wide margins
B|Layout > Orientation|Switch Portrait / Landscape
B|View > Zoom|Zoom the page in or out
I|Ctrl+Alt+1|Apply Heading 1 style (Ctrl+Alt+2 = Heading 2, Ctrl+Alt+3 = Heading 3)
I|Ctrl+Shift+N|Reset paragraph to Normal style
I|Ctrl+Space|Remove manual character formatting
I|Ctrl+Q|Remove manual paragraph formatting
I|Ctrl+1|Single line spacing (Ctrl+2 = double, Ctrl+5 = 1.5)
I|Ctrl+M|Increase indent (Ctrl+Shift+M reduces)
I|Ctrl+T|Create a hanging indent
I|Ctrl+Shift+C|Copy formatting only
I|Ctrl+Shift+V|Paste formatting only
I|Ctrl+Shift+E|Turn Track Changes on or off
I|Ctrl+Alt+M|Insert a comment
I|Ctrl+Alt+F|Insert a footnote (Ctrl+Alt+D = endnote)
I|Ctrl+Shift+Enter|Insert a column break
I|Ctrl+Shift+8|Show or hide paragraph marks and hidden formatting
I|Ctrl+Shift+G|Word Count dialog
I|Shift+F7|Thesaurus – find synonyms
I|F5|Go To page, section, bookmark or line
I|Alt+Shift+Up/Down|Move the current paragraph or list item up or down
I|Alt+Shift+D|Insert the current date field
I|Alt+=|Insert an equation
I|Ctrl+Alt+V|Paste Special (unformatted text, picture, link)
I|Tab in last cell|Adds a new row to a table automatically
I|Insert > Header & Footer|Different text at top and bottom of every page
I|Insert > Text Box / Shapes|Add floating text, arrows, boxes
I|Insert > Page Break vs Section Break|Section breaks let you change orientation or numbering mid-document
I|Layout > Columns|Newspaper-style columns
I|Design > Watermark|Add DRAFT / CONFIDENTIAL watermark
I|Design > Page Borders|Add a border around pages
I|Insert > Drop Cap|Large first letter of a paragraph
I|References > Table of Contents|Auto table of contents from headings
I|References > Insert Caption|Numbered captions for figures and tables
I|References > Cross-reference|Link to a heading, figure or table by number
I|Review > Compare|Compare two versions of a document
I|Review > Accept / Reject|Review tracked changes one by one
I|Table Layout > Convert to Text|Change a table back to plain text (and Text to Table)
I|Table Layout > Sort|Sort table rows A–Z or by number
I|Table Layout > Repeat Header Rows|Repeat table heading on every page
I|=SUM(ABOVE)|Table formula – adds the numbers above the cell
I|Mailings > Start Mail Merge|Send one letter to many people with names filled in automatically
I|File > Info > Protect Document|Add password or restrict editing
P|Alt+F9|Toggle field codes on / off
P|Ctrl+F9|Insert an empty field brace { }
P|F9|Update the selected field (or Ctrl+A then F9 for everything)
P|Ctrl+Shift+F9|Unlink a field – convert to plain text
P|Shift+F5|Return to your last editing position
P|Alt+F8|Open the Macros dialog
P|Alt+F11|Open the VBA editor
P|Alt+Shift+X|Mark an index entry
P|F3|Insert a Quick Part / AutoText building block
P|Alt+Shift+Right/Left|Promote / demote heading in Outline view
P|Ctrl+Alt+O|Switch to Outline view
P|Ctrl+Alt+P|Switch to Print Layout view
P|Ctrl+Alt+N|Switch to Draft view
P|Alt+Q|Tell Me – type any command to run it
P|Alt+Ctrl+K|Auto-format as you type options
P|Find > Use wildcards|Advanced find like [0-9]{3} or special codes ^p (paragraph), ^t (tab), ^w (any space)
P|Find > Replace Format|Replace all text of one font or style with another
P|Home > Styles > Modify|Change a style once – whole document updates
P|Design > Style Set / Themes|Change fonts, colours and look of a full document in one click
P|Home > Multilevel List|Create 1 / 1.1 / 1.1.1 numbering linked to Heading styles
P|Insert > Section Break (Next Page)|Separate headers, orientation and page numbering per section
P|Header > Link to Previous|Switch OFF to use different header/footer in each section
P|Page Setup > Different First Page|No header or number on the cover page
P|Page Setup > Different Odd & Even|Book-style headers
P|Layout > Line Numbers|Number lines for legal documents
P|Layout > Hyphenation|Automatic hyphenation to avoid gaps
P|References > Table of Figures|List of all captions (figures / tables)
P|References > Citations & Bibliography|Insert citations in APA / MLA / IEEE and build a bibliography
P|References > Index|Build an alphabetic index from marked entries
P|Developer > Content Controls|Fill-in forms: text boxes, drop-downs, date pickers, check boxes
P|Developer > Restrict Editing|Allow only form filling or tracked changes
P|Mailings > Rules > If…Then…Else|Conditional text inside mail merge letters
P|Mailings > Labels / Envelopes|Print address labels and envelopes in bulk
P|Insert > Object > Excel Worksheet|Embed a working spreadsheet inside Word
P|Paste Special > Paste Link|Keep Word table linked to Excel – updates automatically
P|View > Navigation Pane|Jump between headings and drag to reorder whole sections
P|File > Info > Inspect Document|Remove hidden data, comments and personal info before sharing
P|Review > Check Accessibility|Fix issues so screen readers can read the document
P|Review > Restrict > Mark as Final|Warn others that the document is final
P|File > Options > Customize Ribbon|Add your own tabs and commands
P|Quick Access Toolbar|Pin Save, Undo, Print Preview, Format Painter for one-click access
P|Save as Template (.dotx)|Reusable letterhead / report format with styles already set
P|File > Export > PDF (Options)|Create a tagged, bookmarked PDF with headings
P|Insert > Dictate (Alt+backtick)|Type by speaking – supports Hindi and English
`);

  const WORD_QA = PJ.qa(`
F|What is MS Word and what is it used for?|A word processor from Microsoft Office used to create, edit, format and print documents such as letters, reports, resumes, applications and forms. Files are saved as .docx.
F|What is the difference between Save and Save As?|Save (Ctrl+S) updates the current file. Save As (F12) creates a new copy with a different name, location or format such as PDF or .doc.
F|How do you make text bold, italic and underlined?|Select the text and press Ctrl+B, Ctrl+I, Ctrl+U or use the buttons in Home > Font group.
F|What is the use of Format Painter?|It copies the formatting (font, size, colour, spacing) of selected text and applies it to other text. Double-click the icon to apply it several times.
F|How do you insert a table in Word?|Insert > Table, then drag to choose rows and columns (or Insert Table for exact numbers). Press Tab in the last cell to add a row.
F|What is the difference between margins and indents?|Margins are the white space between text and page edge for the whole page. Indents move a paragraph in from the margin.
F|How do you add page numbers?|Insert > Page Number > choose position (top/bottom). Use Different First Page if the cover page should have no number.
F|What is Find and Replace? Give an example.|Ctrl+H changes every occurrence of a word in one go – for example replacing all "Mr. Sharma" with "Mr. Verma" in a long letter.
F|How can you convert a Word file to PDF?|File > Save As (or Export) > choose PDF. The PDF keeps layout the same on every device.
E|What are Styles and why should you use them?|Styles store a set of formatting (font, size, spacing). Using Heading 1/2/3 keeps documents consistent, builds the Navigation Pane and lets you create an automatic table of contents. Changing a style updates all text using it.
E|How do you create an automatic Table of Contents?|Apply Heading styles to titles, then References > Table of Contents. After edits right-click it and choose Update Field.
E|Explain Mail Merge with a real use case.|Mail Merge joins a main document (letter) with a data source (Excel list of names/addresses). Used for salary letters, offer letters, certificates or invitations – each copy gets personal details automatically.
E|What is the difference between a page break and a section break?|A page break just starts a new page. A section break creates independent sections so each can have its own orientation, margins, columns, header/footer and page numbering.
E|How do you use Track Changes and Comments in a team?|Turn on Review > Track Changes so every edit is marked with the author's name. Add Comments for questions. The owner then accepts or rejects each change before finalizing.
E|How do you make a different header on the first page or in each section?|Page Setup > Different First Page for the cover. For sections, add Section Breaks and switch off Link to Previous in the header/footer tab.
E|What are Fields and Content Controls?|Fields are dynamic codes (page number, date, TOC, cross-reference) that update with F9. Content Controls (Developer tab) create fill-in forms with drop-downs, date pickers and check boxes.
E|How do you keep a large report formatted professionally?|Use a template with styles, multilevel heading numbering, automatic TOC, captions with cross-references, consistent header/footer, Navigation Pane to restructure, and run Inspect Document and Accessibility Checker before sharing.
E|What is a macro in Word?|A recorded or VBA-coded set of actions that automates repetitive tasks, e.g. applying the company's format with one click. Record via View > Macros, edit in Alt+F11. Save as .docm.
`);

  const WORD_QS = PJ.qs(`
B|Which shortcut saves a Word document?|Ctrl+P|Ctrl+S|Ctrl+O|Ctrl+N|2|Ctrl+S saves. Ctrl+P prints, Ctrl+O opens, Ctrl+N creates a new file.
B|What is the default file extension of a modern Word document?|.doc|.docx|.txt|.wrd|2|Word 2007 and later use .docx.
B|Which shortcut centres the selected text?|Ctrl+L|Ctrl+R|Ctrl+E|Ctrl+J|3|Ctrl+E = centre, L = left, R = right, J = justify.
B|Which key combination applies Undo?|Ctrl+Y|Ctrl+Z|Ctrl+U|Ctrl+X|2|Ctrl+Z undoes, Ctrl+Y redoes.
B|Which shortcut selects all content in a document?|Ctrl+A|Ctrl+S|Ctrl+D|Ctrl+Shift|1|Ctrl+A = Select All.
B|Which feature copies formatting from one text to another?|Spell check|Format Painter|Find and Replace|Thesaurus|2|Format Painter copies formatting only.
B|Which shortcut inserts a page break?|Ctrl+Enter|Shift+Enter|Alt+Enter|Ctrl+Space|1|Ctrl+Enter starts a new page.
B|What does Shift+F3 do on selected text?|Changes text case|Opens Save As|Starts spell check|Inserts a table|1|It cycles lower case, UPPER CASE and Title Case.
B|Which function key runs Spelling & Grammar?|F1|F5|F7|F12|3|F7 = Spelling and Grammar.
B|Which tab contains Margins and Orientation?|Home|Layout|Insert|View|2|Page Setup commands (margins, orientation, size, columns) are in the Layout tab.
I|Which style should be applied to chapter titles to create an automatic TOC?|Normal|Heading 1|Title only|Quote|2|TOC is built from Heading styles.
I|Which shortcut turns Track Changes on or off?|Ctrl+Shift+E|Ctrl+Alt+T|Ctrl+T|Ctrl+E|1|Ctrl+Shift+E toggles Track Changes.
I|Which break lets you use Portrait and Landscape in one document?|Page break|Column break|Section break (Next Page)|Line break|3|Orientation is a section-level setting.
I|Which feature sends the same letter to many people with different names?|Mail Merge|Track Changes|Macros|Thesaurus|1|Mailings > Start Mail Merge.
I|What does Ctrl+Space do?|Opens Navigation|Clears manual character formatting|Inserts space|Locks text|2|It resets the selected text to the style's default character format.
I|How do you insert a footnote quickly?|Ctrl+Alt+F|Ctrl+F|Alt+F|Shift+F|1|Ctrl+Alt+F = footnote, Ctrl+Alt+D = endnote.
I|In a table, which formula adds the numbers above a cell?|=ADD(UP)|=SUM(ABOVE)|=TOTAL(TOP)|=SUM(UP)|2|Word table formulas support ABOVE, BELOW, LEFT, RIGHT.
I|What is a hanging indent mostly used for?|Page numbers|Bibliography / reference lists|Headers|Watermarks|2|First line starts at margin, other lines are indented – used in references and definitions.
P|Which key updates a selected field such as TOC or cross-reference?|F2|F5|F9|F11|3|F9 updates fields. Ctrl+A then F9 updates all.
P|Which shortcut toggles field codes?|Alt+F9|Ctrl+F9|Shift+F9|F9|1|Alt+F9 shows or hides field codes for all fields.
P|To use a different header in each section you must:|Delete the header|Turn off Link to Previous|Use a text box|Use Draft view|2|Link to Previous must be unticked in the header/footer tools.
P|Which file type stores a document with macros?|.docx|.docm|.dotx|.pdf|2|.docm is macro-enabled. .dotx is a template without macros.
P|Which code in Find and Replace (wildcards off) finds a paragraph mark?|^p|^t|^w|^l|1|^p = paragraph mark, ^t = tab, ^w = white space, ^l = manual line break.
P|Which Alt shortcut opens the VBA editor?|Alt+F8|Alt+F9|Alt+F10|Alt+F11|4|Alt+F8 = macro list, Alt+F11 = VBA editor.
P|Which feature keeps a Word table updated from an Excel sheet?|Paste Special – Paste Link|Copy-paste as text|Insert Picture|Format Painter|1|A linked object refreshes when the Excel source changes.
P|What is the best way to change the look of every Heading 2 in a long report?|Select each heading manually|Modify the Heading 2 style|Use Format Painter on each|Use Find only|2|Modifying the style changes all text with that style at once.
`);

  const WORD_TASKS = PJ.tasks(`
B|Type a 5-line application for leave. Make the heading bold, centre it, and set font Calibri 12.|Select heading > Ctrl+B, Ctrl+E. Select all (Ctrl+A) > Home > Font: Calibri, size 12.
B|Create a table of 5 rows × 4 columns for a class timetable and apply a Table Style.|Insert > Table > 4×5 > Table Design > choose a style. Type days in the first column.
B|Insert your photo at the top-right of a page and resize it to 3 cm × 4 cm.|Insert > Picture. Select picture > Picture Format > Size > untick lock aspect ratio if needed, set height 4 cm, width 3 cm. Wrap Text > Square, drag right.
B|Create a bulleted list of 5 skills and a numbered list of 5 steps.|Select lines > Home > Bullets / Numbering.
B|Set margins 1 inch, orientation Portrait, paper size A4, and add page numbers at the bottom centre.|Layout > Margins > Normal; Size > A4; Insert > Page Number > Bottom of Page > Plain Number 2.
B|Use Find & Replace to change every word 'company' to 'organization' in a paragraph you pasted.|Ctrl+H > Find: company, Replace with: organization > Replace All.
B|Run spell check and fix every red and blue underline.|Press F7 and accept or ignore suggestions one by one.
B|Save the document as PDF with the name Practice1.|File > Save As > choose PDF > name Practice1 > Save.
I|Create a 3-page report with Heading 1 for chapters and Heading 2 for sub-topics, then insert an automatic Table of Contents on page 1.|Apply headings via Ctrl+Alt+1/2. Place cursor on page 1 > References > Table of Contents > Automatic Table.
I|Add header 'My Report' and footer 'Page X of Y'.|Insert > Header > Edit. Insert > Footer > Edit > type 'Page ', Insert > Page Number > Current Position; add ' of ' and Insert > Quick Parts > Field > NumPages.
I|Make the cover page without a page number and start numbering from 1 on page 2.|Section break (Next Page) after cover. Unlink footer of section 2 (Link to Previous off). Page Number > Format > Start at 1.
I|Add a picture and a table with captions Figure 1 / Table 1 and cross-refer to them in the text.|References > Insert Caption on each. Then References > Cross-reference > Figure / Table.
I|Turn on Track Changes, edit three sentences, add two comments, then accept all changes.|Ctrl+Shift+E; edit; Ctrl+Alt+M for comments; Review > Accept > Accept All Changes.
I|Make a 2-column newsletter with a heading spanning the full width.|Type heading and text. Select the text only > Layout > Columns > Two. Heading stays in one column section.
I|Insert a table of marks for 5 students and calculate the total with a formula.|Table Layout > Formula > =SUM(LEFT). Press F9 to update after changing marks.
I|Apply a watermark 'DRAFT' and a page border to the document.|Design > Watermark > DRAFT; Design > Page Borders > Box.
P|Mail Merge: create a certificate letter for 5 names from an Excel list.|Create Excel with Name column. Word: Mailings > Start Mail Merge > Letters > Select Recipients > Use Existing List. Insert Merge Field 'Name'. Finish & Merge > Edit Individual Documents.
P|Build a fill-in leave form with a date picker, a drop-down for leave type and a check box for 'Half day'.|Developer tab (enable via File > Options > Customize Ribbon). Insert Date Picker, Drop-Down List and Check Box content controls. Restrict Editing > Filling in forms.
P|Create a multilevel numbering (1, 1.1, 1.1.1) linked to Heading 1, 2 and 3.|Home > Multilevel List > Define New Multilevel List > More > link level 1 to Heading 1, level 2 to Heading 2, level 3 to Heading 3.
P|Record a macro that applies Arial 11, justify and 1.15 spacing, and assign it to a button.|View > Macros > Record Macro > name, assign to Button. Perform the formatting, Stop Recording. Run from the Quick Access Toolbar.
P|Use wildcards to find all 10-digit mobile numbers and highlight them.|Ctrl+H > More > Use wildcards. Find: [0-9]{10}. Replace with: ^& and Format > Highlight. Replace All.
P|Create a company template (.dotx) with logo, header, styles and save it as a custom template.|Design the page, define styles, File > Save As > Word Template (*.dotx) in the Custom Office Templates folder.
P|Insert an index and a table of figures in a long document.|Mark entries with Alt+Shift+X then References > Insert Index. Caption all figures then References > Insert Table of Figures.
P|Paste an Excel table as a link and update it after changing the Excel data.|Copy the Excel range > Word: Paste Special > Paste Link > Microsoft Excel Worksheet Object. Change Excel, right-click object in Word > Update Link.
`);

  PJ.learnTool({
    id: 'ms-word', ico: '📘', name: 'MS Word – Commands & Practice',
    desc: 'All Word commands & shortcuts Beginner → Pro, interview Q&A, practice test and practice sheet',
    cmds: WORD_CMDS, cmdHead: ['Shortcut / Command', 'What it does'], ph: 'Search e.g. bold, table, mail merge, Ctrl+K…',
    qa: WORD_QA, qs: WORD_QS, tasks: WORD_TASKS
  });

  /* ====================== MS POWERPOINT ====================== */
  const PPT_CMDS = PJ.rows(`
B|Ctrl+N|Create a new presentation
B|Ctrl+O|Open a presentation
B|Ctrl+S|Save
B|F12|Save As (PPTX, PDF, PPSX show, MP4 video)
B|Ctrl+M|Insert a new slide
B|Ctrl+D|Duplicate the selected slide or object
B|Ctrl+C|Copy
B|Ctrl+V|Paste
B|Ctrl+Z|Undo
B|Ctrl+Y|Redo
B|Ctrl+B|Bold
B|Ctrl+I|Italic
B|Ctrl+U|Underline
B|Ctrl+E|Centre text
B|Ctrl+K|Insert hyperlink
B|F5|Start the slide show from slide 1
B|Shift+F5|Start the slide show from the current slide
B|Esc|End the slide show
B|Enter|Next slide / next animation (in slide show)
B|Backspace|Previous slide (in slide show)
B|B|Black screen during show (press again to return)
B|W|White screen during show
B|Home > New Slide|Add a slide with a chosen layout
B|Home > Layout|Change the layout of the current slide (Title, Content, Two Content…)
B|Home > Font / Font Size|Change text appearance
B|Insert > Picture|Add an image
B|Insert > Shapes|Draw rectangles, arrows, callouts
B|Insert > Text Box|Add text anywhere on the slide
B|Insert > Table|Add a table
B|Insert > Chart|Add a column, pie or line chart with editable data
B|Design > Themes|Apply a ready-made colour and font design
B|Design > Variants|Change colours / fonts of the current theme
B|Transitions > Fade / Push|Effect when moving between slides
B|Animations > Fade / Appear / Fly In|Basic animation for text and objects
B|View > Slide Sorter|See all slides and drag to reorder
B|View > Notes|Write speaker notes below slides
B|Hold Ctrl and drag|Copy an object while dragging
B|Hold Shift and drag corner|Resize an object keeping proportions
I|Ctrl+G|Group selected objects
I|Ctrl+Shift+G|Ungroup objects
I|Ctrl+Shift+C|Copy formatting
I|Ctrl+Shift+V|Paste formatting
I|Alt+F10|Open the Selection Pane (hide, rename, reorder objects)
I|Alt+F9|Show or hide drawing guides
I|Shift+F9|Show or hide gridlines
I|Ctrl+Shift+Up/Down|Move object forward or backward in order (Bring/Send)
I|Arrow keys + Ctrl|Nudge selected object by a small step
I|Ctrl+Shift+> / <|Increase / decrease font size
I|Ctrl+Enter|Move to next placeholder / create new slide at the end
I|Ctrl+F|Find text in the presentation
I|Ctrl+H|Replace text (and fonts via Home > Replace > Replace Fonts)
I|F7|Spell check
I|Home > Reuse Slides|Bring slides from another presentation keeping their design
I|Home > Section|Divide a long deck into named sections
I|Design > Slide Size|Switch between 16:9, 4:3 and custom sizes
I|Design > Format Background|Solid, gradient, picture or pattern background
I|Insert > SmartArt|Convert lists into process, cycle or hierarchy diagrams
I|Insert > Video / Audio|Embed or link media, trim and set autoplay
I|Insert > Screen Recording|Record your screen and voice into a slide
I|Insert > Action|Make an object jump to a slide, file or website
I|Insert > Slide Number / Date|Add footers to all slides
I|Format > Align / Distribute|Line up objects perfectly
I|Format > Merge Shapes (Union, Combine, Intersect, Subtract)|Create custom shapes from basic shapes
I|Format > Crop to Shape|Crop picture into a circle or any shape
I|Format > Remove Background|Remove picture background without Photoshop
I|Animations > Add Animation|Add multiple animations (entrance, emphasis, exit) to one object
I|Animations > Animation Pane|Reorder and time animations
I|Animations > Start: On Click / With Previous / After Previous|Control how animation starts
I|Transitions > Advance Slide After|Auto-advance slides after seconds
I|Slide Show > Hide Slide|Skip a slide during the show without deleting it
I|Slide Show > Custom Slide Show|Create different versions for different audiences
I|Slide Show > Rehearse Timings|Record time spent per slide
I|File > Export > Create a Video|Export the deck as MP4
I|File > Print > Handouts|Print 3 slides per page with note lines
P|Number then Enter|During show – jump to that slide number
P|Ctrl+P|During show – switch pointer to Pen (Ctrl+A = arrow, E = erase ink)
P|Ctrl+Left click|During show – temporary laser pointer
P|Ctrl+S (in show)|Open All Slides view to jump anywhere
P|Alt+Tab (in show)|Switch to another window without ending the show
P|Win+Plus|Zoom in on screen with Magnifier during presentation
P|View > Slide Master|Edit fonts, colours, logo and layouts once for the whole deck
P|Slide Master > Insert Layout|Create your own custom layout with placeholders
P|Slide Master > Insert Placeholder|Add picture, text, chart placeholders to layouts
P|Design > Variants > Fonts > Customize|Set heading and body font for the whole presentation
P|Transitions > Morph|Smooth cinematic movement between two slides with the same objects
P|Insert > Zoom (Summary / Section / Slide)|Non-linear presentation with clickable thumbnails
P|Animations > Trigger|Start an animation when a specific object is clicked
P|Animations > Motion Paths|Move objects along custom paths
P|Animations > Effect Options > Timing|Fine tune delay, duration, repeat and rewind
P|Animations > Text by word / by letter|Reveal text gradually
P|Home > Arrange > Selection Pane|Name objects and control layers in complex slides
P|Shape Format > Edit Points|Reshape a shape by moving its nodes
P|Eyedropper (Shape Fill)|Pick any colour from the slide or screen
P|Insert > Object > Excel Chart|Embed an editable Excel worksheet
P|Paste Special > Paste Link|Keep chart linked to the Excel source
P|Chart Design > Edit Data|Change chart values from the embedded workbook
P|Insert > Photo Album|Create an album from many images in one step
P|Slide Show > Set Up Slide Show|Kiosk mode, loop continuously, show without animation
P|Slide Show > Record Slide Show|Record narration, ink and webcam per slide
P|Slide Show > Presenter View|Show notes and next slide on your screen, audience sees slides only
P|File > Save As > PowerPoint Show (.ppsx)|Opens directly in slide show mode
P|File > Export > PDF / Handouts|Share as PDF or notes pages
P|File > Info > Compress Media|Reduce file size of large presentations
P|File > Info > Inspect Presentation|Remove comments, metadata and hidden slides
P|Designer (Design > Design Ideas)|AI-powered layout suggestions for the slide
P|Alt+F8 / Alt+F11|Run macros / open VBA editor (save as .pptm)
P|Review > Comments / Compare|Collaborate and merge two versions
P|View > Master > Handout / Notes Master|Design printouts and notes pages
`);

  const PPT_QA = PJ.qa(`
F|What is MS PowerPoint?|A presentation program of Microsoft Office used to make slides with text, pictures, charts, animations and videos. Files are saved as .pptx (slide show .ppsx).
F|What is a slide layout?|A pre-defined arrangement of placeholders on a slide – for example Title Slide, Title and Content or Two Content. Change it from Home > Layout.
F|Difference between Animation and Transition?|Animation moves objects (text, pictures) inside a slide. Transition is the effect when one slide changes to the next.
F|How do you start a slide show?|Press F5 to begin from the first slide or Shift+F5 from the current slide. End with Esc.
F|What are speaker notes?|Private notes under each slide for the presenter, visible in Presenter View and printed as Notes Pages. The audience does not see them.
F|How do you insert a picture, chart or video?|Go to the Insert tab and use Pictures, Chart or Video. You can also drag and drop.
F|What is a Theme?|A design set of colours, fonts and effects applied to the entire presentation from the Design tab.
F|How do you save a PowerPoint as PDF?|File > Save As / Export > PDF. Use this to share without editing or font problems.
F|What is the difference between .pptx and .ppsx?|.pptx opens in editing mode. .ppsx (PowerPoint Show) opens directly in slide show mode.
E|What is the Slide Master and why is it important?|Slide Master controls the layouts, fonts, colours, background and logo for all slides. Editing it once keeps the whole deck consistent and saves time.
E|Explain Presenter View.|It shows the current slide, next slide, speaker notes, timer and pointer tools on the presenter's screen while the audience sees only the slides on the projector.
E|How do you design an effective business presentation?|One idea per slide, large readable fonts (24 pt+), minimum text, consistent theme, high-quality images, charts instead of tables of numbers, clear story (problem > solution > proof > action).
E|How do you control the order and timing of animations?|Use Animation Pane. Choose Start On Click, With Previous or After Previous, adjust delay and duration, and drag items to reorder.
E|What is Morph transition?|Morph smoothly animates objects between two slides that contain the same objects in different positions or sizes – useful for storytelling and product demos.
E|How do you link an Excel chart to PowerPoint?|Copy the chart in Excel and Paste Special > Paste Link in PowerPoint. When Excel data changes, the chart updates after you refresh the link.
E|What are Sections and Custom Shows?|Sections group slides in a long deck (Home > Section). Custom Slide Show lets you present only selected slides to different audiences without copies of the file.
E|How do you reduce the file size of a heavy presentation?|Compress pictures (Picture Format > Compress), compress media, avoid embedded fonts, remove unused layouts and hidden slides, and save as .pptx.
E|How do you make a deck run automatically in a kiosk?|Slide Show > Set Up > Browsed at a kiosk, set Rehearse Timings, loop until Esc. Use Transitions > Advance after.
`);

  const PPT_QS = PJ.qs(`
B|Which key starts the slide show from the first slide?|F1|F5|F7|F9|2|F5 = from start, Shift+F5 = from current slide.
B|Which shortcut inserts a new slide?|Ctrl+N|Ctrl+M|Ctrl+S|Ctrl+L|2|Ctrl+M adds a slide (Ctrl+N creates a new presentation).
B|What is the file extension of a PowerPoint Show?|.pptx|.ppsx|.potx|.pdf|2|.ppsx opens directly in slideshow mode.
B|Which tab contains Themes?|Home|Insert|Design|Review|3|Themes and Variants are in the Design tab.
B|What does the Transitions tab control?|Effect between slides|Movement of text inside a slide|Font style|Chart type|1|Transition = slide-to-slide effect.
B|Which key ends a slide show?|Enter|Esc|Tab|Delete|2|Esc exits the show.
B|Which view is best to reorder many slides quickly?|Normal|Slide Sorter|Notes Page|Reading View|2|Slide Sorter shows thumbnails you can drag.
B|What is a placeholder?|A box on a layout reserved for text, picture or chart|A speaker note|A transition|A hyperlink|1|Placeholders hold content according to the layout.
B|Where do you write notes for the presenter?|Notes pane below the slide|Slide Master|Format Painter|Design tab|1|View > Notes opens the pane below the slide.
B|Which shortcut makes text bold?|Ctrl+B|Ctrl+I|Ctrl+U|Ctrl+K|1|Ctrl+B = bold.
I|Which shortcut groups selected objects?|Ctrl+G|Ctrl+Shift+G|Ctrl+H|Ctrl+J|1|Ctrl+G groups, Ctrl+Shift+G ungroups.
I|Where can you hide, rename and reorder objects on a slide?|Slide Sorter|Selection Pane (Alt+F10)|Slide Master|Outline view|2|Selection Pane lists every object on the slide.
I|Which option makes one animation start automatically after the previous one?|On Click|With Previous|After Previous|Trigger|3|After Previous waits for the earlier animation to finish.
I|Which feature skips a slide without deleting it?|Delete Slide|Hide Slide|Section|Zoom|2|Slide Show > Hide Slide.
I|What does Merge Shapes > Union do?|Combines shapes into one|Subtracts one from other|Keeps overlap only|Splits text|1|Union merges selected shapes into one.
I|Which tool brings slides from another file with its design?|Reuse Slides|Copy Format|Slide Master|Rehearse Timings|1|Home > New Slide > Reuse Slides.
I|How do you change slide size to 4:3?|Design > Slide Size|Home > Layout|View > Zoom|Insert > Table|1|Design > Slide Size > Standard (4:3).
I|Which tool records how long you spend on each slide?|Rehearse Timings|Morph|Zoom|Hide Slide|1|Slide Show > Rehearse Timings.
P|Where do you change the font and logo for every slide at once?|Slide Master|Normal view|Notes Master|Slide Sorter|1|View > Slide Master.
P|Which transition animates matching objects between two slides smoothly?|Fade|Push|Morph|Wipe|3|Morph is available in Microsoft 365 / 2019+.
P|Which feature creates clickable thumbnails for non-linear navigation?|Zoom|Section|Rehearse|Handout|1|Insert > Zoom > Summary / Section / Slide Zoom.
P|During a slide show, which key combination changes the pointer to a pen?|Ctrl+P|Ctrl+A|Ctrl+E|Ctrl+H|1|Ctrl+P = pen, E = erase ink, Ctrl+A = arrow.
P|Which file type supports macros in PowerPoint?|.pptx|.pptm|.ppsx|.potx|2|.pptm is macro-enabled.
P|To keep an Excel chart updated in PowerPoint, you should:|Take a screenshot|Paste Special > Paste Link|Retype data|Use Format Painter|2|Linked charts refresh from the source workbook.
P|Which pane lets you control animation order and timing?|Animation Pane|Notes Pane|Thumbnail Pane|Navigation Pane|1|Animations > Animation Pane.
P|Which feature shows notes only to the presenter?|Reading View|Presenter View|Slide Sorter|Outline|2|Slide Show > Use Presenter View.
`);

  const PPT_TASKS = PJ.tasks(`
B|Create a 5-slide presentation 'About Me' with title slide, education, skills, hobbies and thank-you slide.|Ctrl+M for each slide. Use Title Slide layout first, Title and Content for others. Apply a Design > Theme.
B|Insert a picture on slide 2 and a table (3×3) on slide 3.|Insert > Pictures / Table. Resize holding Shift on a corner.
B|Apply the same transition to all slides and a Fade animation to the title of slide 1.|Transitions > Fade > Apply To All. Select title > Animations > Fade.
B|Add speaker notes to every slide and view the deck in Slide Sorter.|View > Notes, type notes. View > Slide Sorter.
B|Run the slide show from the first slide, jump to slide 3 using the keyboard, then end the show.|F5, type 3 then Enter, Esc.
B|Change the theme colours and fonts of the whole presentation.|Design > Variants > Colors / Fonts.
B|Save the presentation as PDF and as a PowerPoint Show.|File > Save As > PDF; again > PowerPoint Show (.ppsx).
I|Make a 'Company Profile' deck with a column chart of sales for 4 quarters.|Insert > Chart > Column. Edit the data in the sheet that opens. Add chart title and data labels.
I|Convert a bullet list of 5 steps into a SmartArt process diagram.|Select text > Home > Convert to SmartArt > Basic Process.
I|Draw a flowchart using shapes and connectors, then group it.|Insert > Shapes. Use connectors. Select all > Ctrl+G.
I|Create an animation sequence: title enters On Click, then bullets appear One by One After Previous.|Animation Pane > set Start and Effect Options > By paragraph > After Previous.
I|Add a footer with slide number and date on all slides except the title slide.|Insert > Header & Footer > tick Slide number, Date > Don't show on title slide > Apply to All.
I|Use Reuse Slides to bring two slides from another presentation keeping their design.|Home > New Slide > Reuse Slides > Browse; tick Keep source formatting.
I|Create sections (Intro, Body, Conclusion) in a 12-slide deck.|Right-click between slides > Add Section > rename.
I|Align 6 icons in a perfect grid with equal gaps.|Select all > Shape Format > Align > Align Middle and Distribute Horizontally.
P|Edit the Slide Master to add a logo and company colours, and create a new custom layout.|View > Slide Master. Add the logo to the top master, Insert Layout, add placeholders, Close Master View.
P|Create a Morph transition between two slides that moves a product picture and enlarges it.|Duplicate slide 1, move/resize picture on slide 2, Transitions > Morph on slide 2.
P|Create a summary Zoom slide for 4 sections and use it for non-linear navigation.|Insert > Zoom > Summary Zoom > select sections. Present and click thumbnails.
P|Record the slide show with narration and timings and export it as MP4.|Slide Show > Record Slide Show. File > Export > Create a Video.
P|Make a trigger animation: clicking a button shows an answer box (quiz slide).|Add shape for answer with entrance animation, Animation Pane > Trigger > On Click of > Button.
P|Link an Excel chart to a slide and update it after changing the Excel data.|Copy the chart in Excel > PowerPoint Paste Special > Paste Link. Change data in Excel > File > Info > Edit Links > Update Now.
P|Create a self-running kiosk presentation that loops.|Transitions > Advance after 5 s. Slide Show > Set Up Slide Show > Browsed at a kiosk (full screen).
P|Use Merge Shapes to create a custom logo shape and save it as a picture.|Insert two shapes > Shape Format > Merge Shapes > Union/Subtract. Right-click > Save as Picture.
`);

  PJ.learnTool({
    id: 'ms-powerpoint', ico: '📙', name: 'MS PowerPoint – Commands & Practice',
    desc: 'All PowerPoint commands & shortcuts Beginner → Pro, interview Q&A, practice test and practice sheet',
    cmds: PPT_CMDS, cmdHead: ['Shortcut / Command', 'What it does'], ph: 'Search e.g. slide master, animation, morph, F5…',
    qa: PPT_QA, qs: PPT_QS, tasks: PPT_TASKS
  });
})();
