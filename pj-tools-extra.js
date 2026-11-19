/* ===== Extra: full AutoCAD commands, full Excel formulas + interview Q&A, PDF upload in Resume Improvement ===== */
(function () {
  const parse = s => s.trim().split('\n').map(l => l.split('|').map(x => x.trim())).filter(r => r.length === 3);

  /* ---------------- AutoCAD: more commands ---------------- */
  const ACAD_MORE = parse(`
XL|XLINE|Infinite construction line
RAY|RAY|Semi-infinite construction line
SPL|SPLINE|Smooth curve through points
EL|ELLIPSE|Draw an ellipse
DO|DONUT|Filled ring / donut
PO|POINT|Draw a point
DIV|DIVIDE|Place points/blocks at equal divisions
ME|MEASURE|Place points at fixed distances
REV|REVCLOUD|Revision cloud
BO|BOUNDARY|Create closed boundary from area
REG|REGION|Create region from closed objects
WIPEOUT|WIPEOUT|Mask area with background colour
TB|TABLE|Insert a table
TOL|TOLERANCE|Geometric tolerance symbol
MLINE|MLINE|Draw multiple parallel lines
MLSTYLE|MLSTYLE|Multiline style
HELIX|HELIX|3D helix / spring
SOLID|SOLID|2D filled solid
SKETCH|SKETCH|Freehand sketch
PE|PEDIT|Edit polylines (join, width, fit)
SPE|SPLINEDIT|Edit a spline
ED|DDEDIT|Edit text / attribute
SCALETEXT|SCALETEXT|Scale text without moving it
JUSTIFYTEXT|JUSTIFYTEXT|Change text justification
TEXTEDIT|TEXTEDIT|Edit existing text
STYLE / ST|STYLE|Text style manager
QTEXT|QTEXT|Show text as boxes to speed regeneration
TXT2MTXT|TXT2MTXT|Convert single-line to multiline text
FIND|FIND|Find and replace text
SPELL|SPELL|Spell check
TCOUNT|TCOUNT|Auto-number text
TEXTFIT|TEXTFIT|Fit text to a length (Express Tools)
ARCTEXT|ARCTEXT|Text along an arc (Express Tools)
OV / OVERKILL|OVERKILL|Delete duplicate / overlapping objects
DIMSTYLE / D|DIMSTYLE|Dimension style manager
DCO|DIMCONTINUE|Continue dimension chain
DBA|DIMBASELINE|Baseline dimension
DAN|DIMANGULAR|Angular dimension
DAR|DIMARC|Arc length dimension
DOR|DIMORDINATE|Ordinate dimension
DJL|DIMJOGGED|Jogged radius dimension
DCE|DIMCENTER|Centre mark
DED|DIMEDIT|Edit dimension text/obliquing
DIMTEDIT|DIMTEDIT|Move dimension text
DIMBREAK|DIMBREAK|Break dimension line
DIMSPACE|DIMSPACE|Equal spacing between dimensions
DIMUPDATE|DIMSTYLE Apply|Update dimension to current style
DIM|DIM|Smart dimension (auto type)
MLD|MLEADER|Multileader with text
MLS|MLEADERSTYLE|Multileader style
MLEADERALIGN|MLEADERALIGN|Align multileaders
MLEADERCOLLECT|MLEADERCOLLECT|Collect leaders into one
AL|ALIGN|Align objects with points
LEN|LENGTHEN|Change length of open objects
REVERSE|REVERSE|Reverse direction of line/polyline
BLEND|BLEND|Smooth spline between two objects
OFFSETGAPTYPE|OFFSETGAPTYPE|Set corner type when offsetting
LAYMRG|LAYMRG|Merge layers
LAYDEL|LAYDEL|Delete layer with its objects
LAYFRZ|LAYFRZ|Freeze layer of picked object
LAYOFF|LAYOFF|Turn off layer of picked object
LAYISO|LAYISO|Isolate layer of picked object
LAYUNISO|LAYUNISO|Restore isolated layers
LAYON|LAYON|Turn all layers on
LAYTHW|LAYTHW|Thaw all layers
LAYLCK|LAYLCK|Lock layer of picked object
LAYULK|LAYULK|Unlock layer of picked object
LAYWALK|LAYWALK|Walk through layers
LAYCUR|LAYCUR|Change object to current layer
LAYMCUR|LAYMCUR|Make picked object's layer current
LAYP|LAYERP|Previous layer state
LAYERSTATE|LAYERSTATE|Save/restore layer states
LT|LINETYPE|Linetype manager
LW|LWEIGHT|Lineweight settings
CHPROP|CHPROP|Change colour/layer/linetype
CH|PROPERTIES|Open properties (alias)
COL|COLOR|Set current colour
QSELECT|QSELECT|Quick select by property
SELECTSIMILAR|SELECTSIMILAR|Select similar objects
FILTER / FI|FILTER|Advanced object selection filter
GROUP / G|GROUP|Create object group
UNGROUP|UNGROUP|Remove group
ALL|SELECT ALL|Select everything (Ctrl+A)
BE|BEDIT|Block editor
BC|BCLOSE|Close block editor
BATTMAN|BATTMAN|Block attribute manager
ATT|ATTDEF|Define block attribute
ATE|ATTEDIT|Edit attributes
EATTEDIT|EATTEDIT|Enhanced attribute editor
ATTSYNC|ATTSYNC|Sync block attributes
BCOUNT|BCOUNT|Count blocks
BASE|BASE|Set insertion base point
CLIP|CLIP|Clip block / xref / image
REFEDIT|REFEDIT|Edit block/xref in place
REFCLOSE|REFCLOSE|Close reference edit
XR|XREF|External reference manager
XA|XATTACH|Attach an xref
XB|XBIND|Bind xref to drawing
XC|XCLIP|Clip an xref
IM|IMAGE|Attach / manage images
IAT|IMAGEATTACH|Attach raster image
ATTACH|ATTACH|Attach PDF / DWF / image
PDFATTACH|PDFATTACH|Attach PDF underlay
PDFIMPORT|PDFIMPORT|Import PDF as AutoCAD objects
DATAEXTRACTION|DATAEXTRACTION|Extract data to table / Excel
FIELD|FIELD|Insert dynamic field
OLE|INSERTOBJ|Insert OLE object
UNDO / U|UNDO|Undo
REDO|REDO|Redo last undo
OOPS|OOPS|Restore last erased objects
Ctrl+Y|REDO|Redo
Ctrl+C|COPYCLIP|Copy to clipboard
Ctrl+X|CUTCLIP|Cut to clipboard
Ctrl+V|PASTECLIP|Paste
Ctrl+Shift+C|COPYBASE|Copy with base point
Ctrl+Shift+V|PASTEBLOCK|Paste as block
Ctrl+Shift+S|SAVEAS|Save as
Ctrl+N|NEW|New drawing
Ctrl+O|OPEN|Open drawing
Ctrl+A|SELECTALL|Select all
Ctrl+1|PROPERTIES|Properties palette
Ctrl+2|ADCENTER|Design Center
Ctrl+3|TOOLPALETTES|Tool palettes
Ctrl+9|COMMANDLINE|Show / hide command line
Ctrl+0|CLEANSCREENON|Clean screen
Ctrl+Q|QUIT|Exit AutoCAD
Ctrl+Tab|—|Switch between open drawings
F1|HELP|Help
F2|TEXTSCR|Text window
F4|3DOSNAP|3D object snap
F5|ISOPLANE|Cycle isometric planes
F6|DUCS|Dynamic UCS / coordinate display
F7|GRID|Toggle grid
F10|POLAR|Toggle polar tracking
F11|OTRACK|Toggle object snap tracking
F12|DYN|Toggle dynamic input
ESC|CANCEL|Cancel current command
SPACE / ENTER|REPEAT|Repeat last command
ZE|ZOOM Extents|Zoom to all objects
ZW|ZOOM Window|Zoom to a window
ZP|ZOOM Previous|Previous zoom
ZA|ZOOM All|Zoom to drawing limits
ZO|ZOOM Object|Zoom to selected object
ZS|ZOOM Scale|Zoom by scale factor
Z + Enter + .5x|ZOOM 0.5x|Zoom out to half
AV|DSVIEWER|Aerial view
RE|REGEN|Regenerate view
REA|REGENALL|Regenerate all viewports
R|REDRAW|Redraw screen
VIEW / V|VIEW|Named views
VSCURRENT|VSCURRENT|Visual style (2D wireframe / realistic …)
OS|OSNAP|Object snap settings
DS|DSETTINGS|Drafting settings
SE|DSETTINGS|Snap / grid / polar settings
OP|OPTIONS|AutoCAD options
CUI|CUI|Customize user interface
AP|APPLOAD|Load LISP / ARX applications
CAL|CAL|On-screen calculator
QUICKCALC / QC|QUICKCALC|Quick calculator palette
MEASUREGEOM|MEASUREGEOM|Distance, radius, angle, area, volume
ID|ID|Show coordinates of a point
MASSPROP|MASSPROP|Mass properties of regions/solids
TIME|TIME|Drawing time and date
STATUS|STATUS|Drawing status information
SETVAR|SETVAR|View/change system variables
AUDIT|AUDIT|Check and fix drawing errors
RECOVER|RECOVER|Recover damaged drawing
RECOVERALL|RECOVERALL|Recover drawing with xrefs
PU|PURGE|Remove unused blocks, layers, styles
-PURGE|-PURGE|Purge with options (e.g. regapps)
OVERKILL|OVERKILL|Clean duplicate lines
DWGCHECKSTANDARDS|CHECKSTANDARDS|Check drawing against CAD standards
DRAWINGRECOVERY|DRAWINGRECOVERY|Open recovery manager
QNEW|QNEW|New drawing from template
SAVEALL|SAVEALL|Save all open drawings
CLOSE|CLOSE|Close current drawing
CLOSEALL|CLOSEALL|Close all drawings
ETRANSMIT|ETRANSMIT|Package drawing with xrefs & fonts
ARCHIVE|ARCHIVE|Archive drawing set
EXPORT|EXPORT|Export to other formats
IMPORT|IMPORT|Import other formats
DXFOUT|DXFOUT|Save as DXF
PUBLISH|PUBLISH|Publish sheets to PDF/DWF
EXPORTPDF|EXPORTPDF|Export drawing to PDF
PAGESETUP|PAGESETUP|Page setup manager
PLOTSTYLE|PLOTSTYLE|Set plot style
STYLESMANAGER|STYLESMANAGER|Plot style manager (CTB/STB)
PLOTTERMANAGER|PLOTTERMANAGER|Plotter manager
PREVIEW / PRE|PREVIEW|Print preview
LA|LAYOUT|Create / switch layouts
LAYOUT|LAYOUT|Layout management
MV|MVIEW|Create layout viewports
VPORTS|VPORTS|Viewport configuration
MS|MSPACE|Switch to model space inside viewport
PS|PSPACE|Switch to paper space
VPCLIP|VPCLIP|Clip viewport boundary
VPMAX|VPMAX|Maximise viewport
VPMIN|VPMIN|Restore viewport
MVSETUP|MVSETUP|Setup drawing sheet / scale
SCALELISTEDIT|SCALELISTEDIT|Edit scale list
ANNOALLVISIBLE|ANNOALLVISIBLE|Show annotative objects at all scales
ANNOSCALE|ANNOSCALE|Set annotation scale
OBJECTSCALE|OBJECTSCALE|Add/remove annotation scales
UCS|UCS|User coordinate system
UCSMAN|UCSMAN|Named UCS manager
PLAN|PLAN|View plan of current UCS
DDVPOINT|VPOINT|Set 3D viewpoint
3DORBIT / 3DO|3DORBIT|Orbit around model
ORBIT|ORBIT|Constrained orbit
SHADEMODE|SHADEMODE|Shading mode
ISOPLANE|ISOPLANE|Isometric drawing plane
DRAWORDER / DR|DRAWORDER|Send to back / bring to front
TEXTTOFRONT|TEXTTOFRONT|Bring text to front
HATCHTOBACK|HATCHTOBACK|Send hatch to back
HE|HATCHEDIT|Edit hatch
GRADIENT|GRADIENT|Gradient fill
SOLIDEDIT|SOLIDEDIT|Edit solid faces/edges
EXT|EXTRUDE|Extrude 2D to 3D
PRESSPULL|PRESSPULL|Press / pull area
REV|REVOLVE|Revolve profile
SWEEP|SWEEP|Sweep profile along path
LOFT|LOFT|Loft between profiles
BOX|BOX|3D box
CYL|CYLINDER|3D cylinder
SPH|SPHERE|3D sphere
CONE|CONE|3D cone
UNI|UNION|Union solids
SU|SUBTRACT|Subtract solids
IN|INTERSECT|Intersect solids
SLICE|SLICE|Slice a solid
SECTIONPLANE|SECTIONPLANE|Section plane
FLATSHOT|FLATSHOT|2D view from 3D model
RENDER|RENDER|Render the model
MATERIALS|MATERIALS|Materials browser
LIGHT|LIGHT|Add a light
SHEETSET / SSM|SHEETSETMANAGER|Sheet Set Manager
ADC|ADCENTER|Design Center
TP|TOOLPALETTES|Tool palettes
MARKUP|MARKUP|Markup Set Manager
DESIGNFEEDS|DESIGNFEEDS|Share design with team
SHAREVIEW|SHAREVIEW|Publish shared view to web
TRIMTOGGLE|TRIM (Shift)|Hold Shift in TRIM to EXTEND
ARRAYCLASSIC|ARRAYCLASSIC|Classic array dialog
ARRAYRECT|ARRAYRECT|Rectangular array
ARRAYPOLAR|ARRAYPOLAR|Polar array
ARRAYPATH|ARRAYPATH|Array along a path
ARRAYEDIT|ARRAYEDIT|Edit associative array
CHSPACE|CHSPACE|Move objects between model & paper space
SCRIPT|SCRIPT|Run a script file
ACTRECORD|ACTRECORD|Record action macro
ACTSTOP|ACTSTOP|Stop recording action
ACTUSERINPUT|ACTUSERINPUT|Pause for user input in macro
VLIDE|VLISP|Visual LISP editor
LISPSYS|LISPSYS|LISP system setting
NETLOAD|NETLOAD|Load .NET application
GEO|GEOGRAPHICLOCATION|Set geographic location
MAPCONNECT|MAPCONNECT|Connect to online map
LOGFILEON|LOGFILEON|Start logging command-line text
LOGFILEOFF|LOGFILEOFF|Stop logging
TEXTSCR|TEXTSCR|Open text window
GRAPHSCR|GRAPHSCR|Return to drawing window
NEWSHEET|NEWSHEET|New sheet in sheet set
DWGPROPS|DWGPROPS|Drawing properties
INSUNITS|INSUNITS|Units for inserted blocks
DIMSCALE|DIMSCALE|Overall dimension scale (set variable)
LTSCALE|LTSCALE|Global linetype scale
MSLTSCALE|MSLTSCALE|Scale linetypes by annotation scale
PSLTSCALE|PSLTSCALE|Paper-space linetype scale
FILEDIA|FILEDIA|File dialog on/off (set 1 = on)
PICKFIRST|PICKFIRST|Select before command
PICKADD|PICKADD|Add to selection setting
HPSCALE|HPSCALE|Default hatch scale
FILLMODE|FILLMODE|Show / hide fills
FRONTCLIP|FRONTCLIP|Clipping planes (set variable)
`);

  /* HVAC-specific AutoCAD tips as commands */
  const ACAD_HVAC = parse(`
LAYER → DUCT-SUPPLY|LAYER|Make separate layers for supply, return, fresh air, CHW pipe, drain
PL + width|PLINE → Width|Draw duct with width = duct size (e.g. 300)
O (offset)|OFFSET|Draw duct from centre line using offset of half width
DIMLINEAR|DLI|Dimension duct size on the drawing
MLD + text|MLEADER|Tag diffuser / grille / FCU with size & CFM
BLOCK + ATT|BLOCK + ATTDEF|Make diffuser / AHU block with attributes (CFM, size)
DATAEXTRACTION|DATAEXTRACTION|Export BOQ of blocks (diffusers, FCUs) to Excel
LENGTHEN|LEN → DE|Get exact duct run lengths for measurement
LIST|LI|Check polyline length / area for duct & insulation quantity
`);

  const seen = new Set(ACAD.map(r => r[1].toLowerCase() + '|' + r[0].toLowerCase()));
  const seenCmd = new Set(ACAD.map(r => r[1].toLowerCase()));
  ACAD_MORE.concat(ACAD_HVAC).forEach(r => {
    const k = r[1].toLowerCase() + '|' + r[0].toLowerCase();
    if (seen.has(k) || (seenCmd.has(r[1].toLowerCase()) && /^[A-Z]{1,3}$/.test(r[0]) === false && ACAD.some(a => a[1].toLowerCase() === r[1].toLowerCase()))) return;
    seen.add(k); seenCmd.add(r[1].toLowerCase()); ACAD.push(r);
  });
  const ac = TOOLS.find(t => t.id === 'autocad');
  if (ac) { ac.desc = `${ACAD.length}+ AutoCAD commands & shortcuts – search, copy, HVAC drawing tips`; }

  /* ---------------- Excel: more formulas ---------------- */
  const XL_MORE = parse(`
SUBTOTAL|=SUBTOTAL(109,A1:A10)|Sum that ignores filtered-out rows
AGGREGATE|=AGGREGATE(9,6,A1:A10)|Sum ignoring errors/hidden rows
PRODUCT|=PRODUCT(A1:A5)|Multiply numbers
MEDIAN|=MEDIAN(A1:A10)|Middle value
MODE|=MODE.SNGL(A1:A10)|Most frequent value
COUNTBLANK|=COUNTBLANK(A1:A10)|Count empty cells
AVERAGEIF|=AVERAGEIF(A:A,"Delhi",B:B)|Average with a condition
AVERAGEIFS|=AVERAGEIFS(C:C,A:A,"Delhi",B:B,"Jan")|Average with multiple conditions
MAXIFS / MINIFS|=MAXIFS(C:C,A:A,"Delhi")|Max / min with conditions
SUMSQ|=SUMSQ(A1:A5)|Sum of squares
MOD|=MOD(10,3)|Remainder after division
INT|=INT(A1)|Round down to integer
TRUNC|=TRUNC(A1,2)|Cut off decimals without rounding
CEILING|=CEILING(A1,5)|Round up to a multiple
FLOOR|=FLOOR(A1,5)|Round down to a multiple
MROUND|=MROUND(A1,5)|Round to nearest multiple
ABS|=ABS(A1)|Absolute value
POWER|=POWER(2,3)|Raise to a power
SQRT|=SQRT(A1)|Square root
PI|=PI()*A1^2|Value of π (area of circle)
RAND|=RAND()|Random decimal 0–1
RANDBETWEEN|=RANDBETWEEN(1,100)|Random whole number
RANDARRAY|=RANDARRAY(5,2,1,100,TRUE)|Array of random numbers
SEQUENCE|=SEQUENCE(10)|Generate number series
ROW / COLUMN|=ROW(A5)|Row / column number
ROWS / COLUMNS|=ROWS(A1:A10)|Count rows / columns in range
OFFSET|=OFFSET(A1,2,1)|Reference shifted from a cell
INDIRECT|=INDIRECT("Sheet2!A1")|Reference from text
ADDRESS|=ADDRESS(2,3)|Cell address from row & column
CELL|=CELL("filename")|Info about cell / workbook
TRANSPOSE|=TRANSPOSE(A1:C3)|Switch rows and columns
LOOKUP|=LOOKUP(E2,A:A,C:C)|Simple vector lookup
XMATCH|=XMATCH(E2,A:A)|Modern MATCH
MATCH|=MATCH(E2,A:A,0)|Position of a value
LET|=LET(x,A1*2,x+1)|Name a calculation inside a formula
LAMBDA|=LAMBDA(x,x*2)(5)|Create custom function
TAKE / DROP|=TAKE(A1:C10,3)|First/last rows or columns (365)
CHOOSECOLS|=CHOOSECOLS(A1:D10,1,3)|Pick columns (365)
VSTACK / HSTACK|=VSTACK(A1:B3,D1:E3)|Stack ranges (365)
TEXTSPLIT|=TEXTSPLIT(A1,",")|Split text into cells (365)
TEXTBEFORE / TEXTAFTER|=TEXTAFTER(A1,"@")|Text before/after a delimiter (365)
SORTBY|=SORTBY(A1:B10,B1:B10,-1)|Sort by another range
GROUPBY|=GROUPBY(A2:A20,C2:C20,SUM)|Pivot-style summary by formula (365)
BYROW / BYCOL|=BYROW(A1:C5,LAMBDA(r,SUM(r)))|Apply function row/column-wise
REDUCE / SCAN|=REDUCE(0,A1:A5,LAMBDA(a,b,a+b))|Running calculations
TOCOL / TOROW|=TOCOL(A1:C3)|Flatten range into one column/row
CONCATENATE|=CONCATENATE(A1," ",B1)|Join text (older)
CONCAT|=CONCAT(A1:A5)|Join text from ranges
& (ampersand)|=A1&" "&B1|Join text quickly
LEFT|=LEFT(A1,3)|First N characters
RIGHT|=RIGHT(A1,4)|Last N characters
MID|=MID(A1,2,5)|Characters from the middle
FIND|=FIND("-",A1)|Position of text (case-sensitive)
SEARCH|=SEARCH("-",A1)|Position of text (not case-sensitive)
REPLACE|=REPLACE(A1,1,3,"New")|Replace by position
CLEAN|=CLEAN(A1)|Remove non-printable characters
EXACT|=EXACT(A1,B1)|Compare text, case-sensitive
REPT|=REPT("★",5)|Repeat text
VALUE|=VALUE(A1)|Convert text to number
TEXT (number)|=TEXT(A1,"#,##0.00")|Format a number as text
NUMBERVALUE|=NUMBERVALUE("1.234,5",",",".")|Text to number with separators
CHAR / CODE|=CHAR(65)|Character from code / code from character
UNICHAR|=UNICHAR(8377)|Unicode character (₹ = 8377)
ISNUMBER|=ISNUMBER(A1)|Check if number
ISTEXT|=ISTEXT(A1)|Check if text
ISBLANK|=ISBLANK(A1)|Check if empty
ISERROR|=ISERROR(A1)|Check if error
ISNA|=ISNA(A1)|Check if #N/A
IFNA|=IFNA(VLOOKUP(E2,A:C,3,0),"Not found")|Replace #N/A only
NOT|=NOT(A1>5)|Reverse a condition
XOR|=XOR(A1>5,B1>5)|True if exactly one is true
SWITCH|=SWITCH(A1,1,"Low",2,"Mid","High")|Match value to results
TRUE / FALSE|=TRUE()|Logical values
N|=N(A1)|Convert value to number
NA|=NA()|Return #N/A on purpose
DATE|=DATE(2026,11,19)|Create a date from y,m,d
YEAR / MONTH / DAY|=YEAR(A1)|Extract part of a date
WEEKDAY|=WEEKDAY(A1,2)|Day of week number
WEEKNUM|=WEEKNUM(A1)|Week number of year
EDATE|=EDATE(A1,3)|Same date N months later
DAYS|=DAYS(B1,A1)|Days between dates
DAYS360|=DAYS360(A1,B1)|Days on 360-day year
WORKDAY|=WORKDAY(A1,10)|Date after N working days
NETWORKDAYS.INTL|=NETWORKDAYS.INTL(A1,B1,11)|Working days with custom weekends
YEARFRAC|=YEARFRAC(A1,B1)|Fraction of year between dates
TIME|=TIME(9,30,0)|Create a time
HOUR / MINUTE / SECOND|=HOUR(A1)|Extract time parts
DATEVALUE / TIMEVALUE|=DATEVALUE("19-11-2026")|Convert text to date / time
ISOWEEKNUM|=ISOWEEKNUM(A1)|ISO week number
PPMT / IPMT|=IPMT(9%/12,1,60,-1000000)|Principal / interest part of EMI
NPER|=NPER(9%/12,-20000,1000000)|Number of EMI periods
RATE|=RATE(60,-20000,1000000)*12|Interest rate of a loan
PV|=PV(9%/12,60,-20000)|Present value
NPV|=NPV(10%,B2:B6)+B1|Net present value
IRR|=IRR(B1:B6)|Internal rate of return
XIRR|=XIRR(B1:B6,A1:A6)|IRR with dates
XNPV|=XNPV(10%,B1:B6,A1:A6)|NPV with dates
SLN|=SLN(100000,10000,5)|Straight-line depreciation
DB / DDB|=DB(100000,10000,5,1)|Declining-balance depreciation
EFFECT / NOMINAL|=EFFECT(10%,12)|Effective / nominal interest rate
CUMIPMT|=CUMIPMT(9%/12,60,1000000,1,12,0)|Interest paid in a period
STDEV|=STDEV.S(A1:A10)|Standard deviation
VAR|=VAR.S(A1:A10)|Variance
CORREL|=CORREL(A1:A10,B1:B10)|Correlation
FORECAST|=FORECAST.LINEAR(6,B1:B5,A1:A5)|Predict value by trend
TREND|=TREND(B1:B5,A1:A5,A6)|Linear trend values
PERCENTILE|=PERCENTILE.INC(A1:A10,0.9)|Nth percentile
QUARTILE|=QUARTILE.INC(A1:A10,1)|Quartile value
PERCENTRANK|=PERCENTRANK.INC(A1:A10,A2)|Percent rank of value
RANK.EQ / RANK.AVG|=RANK.EQ(A1,$A$1:$A$10,0)|Rank with tie handling
FREQUENCY|=FREQUENCY(A1:A20,C1:C5)|Count in ranges (bins)
COUNTIF (wildcard)|=COUNTIF(A:A,"*pipe*")|Count text containing a word
COUNTIF (duplicates)|=IF(COUNTIF(A:A,A1)>1,"Duplicate","")|Find duplicates
SUMIF (wildcard)|=SUMIF(A:A,"AC*",B:B)|Sum where text begins with "AC"
SUMPRODUCT (condition)|=SUMPRODUCT((A1:A10="Delhi")*(B1:B10))|Conditional sum without SUMIFS
Dropdown list|Data → Data Validation → List|Create a dropdown in a cell
Conditional formatting|Home → Conditional Formatting|Highlight cells by rule
Remove duplicates|Data → Remove Duplicates|Delete repeated rows
Text to Columns|Data → Text to Columns|Split text by delimiter
Flash Fill|Ctrl+E|Auto-fill pattern from example
Pivot Table|Insert → PivotTable|Summarise large data quickly
Goal Seek|Data → What-If → Goal Seek|Find input for target result
Freeze Panes|View → Freeze Panes|Keep header row visible
Named range|Ctrl+F3|Name a range / use names in formulas
Absolute reference|=$A$1|Lock cell with F4
Shortcut: Ctrl+;|Ctrl+;|Insert today's date
Shortcut: Ctrl+Shift+;|Ctrl+Shift+;|Insert current time
Shortcut: Ctrl+D / Ctrl+R|Ctrl+D|Fill down / fill right
Shortcut: Ctrl+Arrow|Ctrl+Arrow|Jump to edge of data
Shortcut: Ctrl+Shift+Arrow|Ctrl+Shift+Arrow|Select to end of data
Shortcut: Ctrl+Space / Shift+Space|Ctrl+Space|Select column / row
Shortcut: Ctrl+Shift++|Ctrl+Shift++|Insert cells / row / column
Shortcut: Ctrl+-|Ctrl+-|Delete cells / row / column
Shortcut: F2|F2|Edit cell
Shortcut: F4|F4|Toggle absolute reference / repeat action
Shortcut: Alt+Enter|Alt+Enter|New line inside a cell
Shortcut: Ctrl+Grave (the ~ key)|Ctrl+~|Show all formulas
Shortcut: Ctrl+1|Ctrl+1|Format cells
Shortcut: Ctrl+Shift+$ / %|Ctrl+Shift+%|Currency / percentage format
Shortcut: Alt+H+O+I|Alt+H+O+I|AutoFit column width
Shortcut: Ctrl+PageUp/Down|Ctrl+PageDown|Next / previous sheet
Shortcut: F12|F12|Save As
Shortcut: Ctrl+Z / Ctrl+Y|Ctrl+Z|Undo / redo
Shortcut: Ctrl+F / Ctrl+H|Ctrl+H|Find / Replace
`);
  const xs = new Set(XL.map(r => r[0].toLowerCase()));
  XL_MORE.forEach(r => { if (!xs.has(r[0].toLowerCase())) { xs.add(r[0].toLowerCase()); XL.push(r); } });

  /* ---------------- Excel: interview questions & answers ---------------- */
  const XQ = [
    ['Basics', [
      ['What is the difference between a workbook and a worksheet?', 'A workbook is the whole Excel file (.xlsx). A worksheet is a single sheet (tab) inside it. One workbook can contain many worksheets.'],
      ['What is a cell, a range and a cell reference?', 'A cell is one box (e.g. B2). A range is a group of cells (B2:D10). A reference is the address used in formulas – relative (A1), absolute ($A$1) or mixed ($A1 / A$1).'],
      ['Relative vs absolute vs mixed reference?', 'Relative changes when copied (A1). Absolute is locked ($A$1 – press F4). Mixed locks only the row or the column (A$1 or $A1).'],
      ['What is the difference between a formula and a function?', 'A formula is any calculation starting with "=" (e.g. =A1+B1). A function is a built-in routine used inside formulas (SUM, IF, VLOOKUP).'],
      ['How many rows and columns does Excel have?', '1,048,576 rows and 16,384 columns (A to XFD) in modern Excel.'],
      ['What are the common Excel error values?', '#DIV/0! (divide by zero), #N/A (value not found), #NAME? (wrong function/name), #REF! (deleted/invalid reference), #VALUE! (wrong data type), #NUM! (invalid number), #NULL! (wrong range operator), ##### (column too narrow).'],
      ['How do you enter data in many cells at once?', 'Select the cells, type the value and press Ctrl+Enter.'],
      ['How do you insert a new line inside a cell?', 'Press Alt+Enter.'],
      ['What is AutoFill?', 'Dragging the fill handle (small square at cell corner) to copy values or continue a series such as dates, months or numbers.'],
      ['What is Flash Fill?', 'Ctrl+E – Excel detects a pattern from your example (e.g. first names from full names) and fills the rest automatically.']
    ]],
    ['Formulas & functions', [
      ['Difference between VLOOKUP and HLOOKUP?', 'VLOOKUP searches the first column and returns from a column to the right (vertical data). HLOOKUP searches the first row and returns from a row below (horizontal data).'],
      ['VLOOKUP limitations? What is better?', 'VLOOKUP cannot look left, breaks if columns are inserted (fixed column number) and is slower on big data. Use INDEX+MATCH or XLOOKUP instead.'],
      ['What is XLOOKUP and why is it better?', 'XLOOKUP(lookup, lookup_array, return_array, [not_found], [match_mode], [search_mode]) – looks in any direction, defaults to exact match, has built-in "not found" and can search from the bottom.'],
      ['Explain INDEX + MATCH.', 'MATCH finds the position of a value in a range; INDEX returns the value at that position from another range. =INDEX(C:C,MATCH(E2,A:A,0)) – works left or right and is column-insert safe.'],
      ['What is the difference between COUNT, COUNTA, COUNTBLANK and COUNTIF?', 'COUNT: numeric cells. COUNTA: non-empty cells. COUNTBLANK: empty cells. COUNTIF: cells matching one condition (COUNTIFS for several).'],
      ['SUMIF vs SUMIFS?', 'SUMIF has one condition: SUMIF(range, criteria, sum_range). SUMIFS allows many: SUMIFS(sum_range, range1, crit1, range2, crit2).'],
      ['How do nested IF and IFS differ?', 'Nested IF puts one IF inside another. IFS (Excel 2019+) tests multiple conditions in order without nesting: =IFS(A1>=90,"A",A1>=75,"B",TRUE,"C").'],
      ['What is IFERROR / IFNA?', 'IFERROR returns a custom value for any error. IFNA handles only #N/A – safer because it does not hide other mistakes.'],
      ['How do you find duplicates?', 'Conditional Formatting → Highlight Cells Rules → Duplicate Values, or =COUNTIF(A:A,A2)>1. Remove them via Data → Remove Duplicates.'],
      ['How to get unique values?', 'Use =UNIQUE(A2:A100) in Excel 365/2021, or Data → Remove Duplicates / Advanced Filter → Unique records only.'],
      ['How do you calculate age from date of birth?', '=DATEDIF(A1,TODAY(),"Y") gives completed years; "YM" gives remaining months and "MD" remaining days.'],
      ['What is the difference between TODAY() and NOW()?', 'TODAY() returns the current date; NOW() returns the date and time. Both update every time the sheet recalculates.'],
      ['How to combine text from two cells?', '=A1&" "&B1, =CONCAT(A1,B1) or =TEXTJOIN(" ",TRUE,A1:B1).'],
      ['What does SUMPRODUCT do?', 'Multiplies matching items of arrays and adds them: =SUMPRODUCT(Qty,Rate) gives total amount. It can also do conditional sums without SUMIFS.'],
      ['How to calculate EMI in Excel?', '=PMT(rate/12, months, -loan_amount). Example: =PMT(9%/12,60,-1000000).'],
      ['What is a dynamic array / spill?', 'In Excel 365 a single formula (FILTER, SORT, UNIQUE, SEQUENCE) returns many values that "spill" into neighbouring cells automatically. Reference the spill range with A1#.'],
      ['What are LET and LAMBDA?', 'LET assigns names to values inside a formula to make it shorter and faster. LAMBDA lets you create your own reusable custom function.']
    ]],
    ['Data tools', [
      ['What is a Pivot Table?', 'A tool that summarises large data by dragging fields into Rows, Columns, Values and Filters – totals, counts and averages without formulas. Insert → PivotTable; refresh with Alt+F5 after data changes.'],
      ['What are slicers and timelines?', 'Visual filter buttons for Pivot Tables/Tables. Timelines are slicers specifically for date fields.'],
      ['What is Data Validation?', 'Restricts what can be typed in a cell – whole numbers, dates, or a dropdown list (Data → Data Validation → List).'],
      ['What is Conditional Formatting?', 'Automatically formats cells (colour, icons, data bars) based on rules – e.g. highlight values below target in red.'],
      ['Sort vs Filter?', 'Sort rearranges rows in an order. Filter hides rows that do not match the criteria without deleting them (Ctrl+Shift+L).'],
      ['What is an Excel Table (Ctrl+T)?', 'A structured range with auto-expanding formulas, filters, banded rows and structured references like Table1[Sales]. Charts and pivots update automatically.'],
      ['What is Power Query?', 'Get & Transform tool to import, clean and merge data from Excel, CSV, web or databases with repeatable steps. Refresh updates everything.'],
      ['What is Power Pivot?', 'Add-in/data model for working with millions of rows, relationships between tables and DAX measures.'],
      ['What is Goal Seek?', 'Data → What-If Analysis → Goal Seek finds the input value that gives a target result (e.g. required sales for a profit of ₹5 lakh).'],
      ['What is Solver?', 'An add-in that finds the optimal value (max/min) for a formula by changing several cells under constraints.'],
      ['How do you protect a sheet or workbook?', 'Review → Protect Sheet (lock cells/formulas) or File → Info → Protect Workbook → Encrypt with Password.'],
      ['How do you split full name into first and last?', 'Data → Text to Columns (delimiter: space), Flash Fill (Ctrl+E) or =TEXTSPLIT(A1," ").'],
      ['How to remove extra spaces?', '=TRIM(A1) removes leading, trailing and double spaces. Use CLEAN for non-printing characters.'],
      ['How do you link data between sheets or files?', 'Type = then click a cell in the other sheet/workbook: =Sheet2!A1 or =[Book2.xlsx]Sheet1!$A$1.'],
      ['How to freeze headings?', 'View → Freeze Panes → Freeze Top Row (or select the cell below/right of what you want to freeze).']
    ]],
    ['Charts, printing & productivity', [
      ['Which chart types are commonly used?', 'Column/Bar (comparison), Line (trend), Pie/Doughnut (share of total), Scatter (relationship), Combo (two scales), Waterfall, Histogram.'],
      ['What are sparklines?', 'Tiny in-cell charts (Insert → Sparklines) showing a trend for a row of data.'],
      ['How do you set a print area and fit to one page?', 'Page Layout → Print Area → Set Print Area; Page Setup → Fit to 1 page wide; Print Titles repeats header rows on every page.'],
      ['What is a macro? What is VBA?', 'A macro records/automates repeated steps. VBA (Visual Basic for Applications) is the language behind macros; edit it with Alt+F11. Save as .xlsm.'],
      ['Difference between .xls, .xlsx, .xlsm and .csv?', '.xls old format; .xlsx modern format without macros; .xlsm with macros; .csv plain text, comma-separated, no formatting or formulas.'],
      ['What is the difference between Copy-Paste and Paste Special?', 'Paste Special lets you paste only values, formulas, formats, column widths, transpose, or do operations (add/multiply) – Ctrl+Alt+V.'],
      ['How to calculate percentage change?', '=(New-Old)/Old, then format as %. Percentage of total: =A1/SUM($A$1:$A$10).'],
      ['How do you make a drop-down dependent on another?', 'Use named ranges and =INDIRECT(A2) in the second Data Validation list, or dynamic arrays with FILTER.'],
      ['How to handle large data and speed up Excel?', 'Use Tables/Power Query, avoid whole-column volatile formulas (OFFSET, INDIRECT), convert finished formulas to values, and set calculation to manual when needed.'],
      ['Most useful Excel shortcuts?', 'Ctrl+C/V/X/Z/Y, Ctrl+Shift+L (filter), Ctrl+T (table), Ctrl+E (flash fill), F4 (lock reference), Alt+= (AutoSum), Ctrl+; (date), Ctrl+Arrow (jump), Ctrl+1 (format cells).']
    ]],
    ['Practical HVAC / Site Excel examples', [
      ['How to calculate TR from CFM and temperature difference?', 'Sensible TR ≈ (CFM × 1.08 × ΔT in °F) ÷ 12000. In Excel: =(A2*1.08*B2)/12000.'],
      ['How to prepare a BOQ with automatic total?', 'Columns: Sr, Description, Qty, Unit, Rate, Amount. Amount: =C2*E2. Total: =SUM(F2:F100). GST: =F101*18%. Grand total: =F101+F102. Convert to Table (Ctrl+T) so formulas auto-extend.'],
      ['How to bring item rate from a rate list into the BOQ?', '=XLOOKUP(B2,RateList!A:A,RateList!C:C,"Not found") or =VLOOKUP(B2,RateList!A:C,3,FALSE).'],
      ['How to make a daily billing / progress summary?', 'Keep data as a Table and use a Pivot Table: Rows = Site/Item, Values = Sum of Amount, Filter/Slicer = Date. Refresh after adding entries.'],
      ['How to calculate duct area or insulation quantity?', 'Rectangular duct area = 2×(W+H)×Length. =2*(A2+B2)/1000*C2 (W,H in mm, length in m) gives sq.m. Add 10% wastage: =D2*1.1.'],
      ['How to add Qty × Rate across many rows?', '=SUMPRODUCT(C2:C50,E2:E50).']
    ]]
  ];
  const xt = TOOLS.find(t => t.id === 'excel-formulas');
  if (xt) {
    const total = XQ.reduce((n, g) => n + g[1].length, 0);
    xt.name = 'Excel – Formulas & Questions';
    xt.desc = `${XL.length}+ formulas & shortcuts and ${total}+ interview questions with answers`;
    const orig = xt.render;
    xt.render = el => {
      el.innerHTML = '<div class="tabs"><button class="tab on" data-t="f">Formulas &amp; Shortcuts</button><button class="tab" data-t="q">Questions &amp; Answers</button></div><div id="xl-f"></div><div id="xl-q" hidden></div>';
      const f = $('#xl-f', el), q = $('#xl-q', el);
      orig(f);
      q.innerHTML = `<div class="card"><input id="qs2" type="search" placeholder="Search Excel questions… (vlookup, pivot, shortcut)"></div>` +
        XQ.map(g => `<div class="card grp"><h3>${esc(g[0])}</h3>${g[1].map(i => `<details data-s="${esc((i[0] + ' ' + i[1]).toLowerCase())}"><summary>${esc(i[0])}</summary><p>${esc(i[1])}</p></details>`).join('')}</div>`).join('');
      $('#qs2', q).addEventListener('input', e => {
        const v = e.target.value.toLowerCase().trim();
        $$('details', q).forEach(d => d.hidden = v && !d.dataset.s.includes(v));
        $$('.grp', q).forEach(g => g.hidden = v && !$$('details', g).some(d => !d.hidden));
      });
      $$('.tab', el).forEach(b => b.onclick = () => {
        $$('.tab', el).forEach(x => x.classList.toggle('on', x === b));
        f.hidden = b.dataset.t !== 'f'; q.hidden = b.dataset.t !== 'q';
      });
    };
  }

  /* ---------------- Resume Improvement: PDF / TXT upload ---------------- */
  const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const loadPdfJs = () => window.pdfjsLib ? Promise.resolve() : new Promise((ok, no) => {
    const s = document.createElement('script'); s.src = PDFJS;
    s.onload = () => { try { pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER; ok(); } catch (e) { no(e); } };
    s.onerror = () => no(new Error('PDF reader could not load. Please check your internet connection.'));
    document.head.appendChild(s);
  });
  async function pdfToText(file) {
    await loadPdfJs();
    const doc = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    let out = '';
    for (let p = 1; p <= doc.numPages; p++) {
      const content = await (await doc.getPage(p)).getTextContent();
      let line = '', y = null;
      content.items.forEach(it => {
        const ny = it.transform[5];
        if (y !== null && Math.abs(ny - y) > 3) { out += line.trimEnd() + '\n'; line = ''; }
        line += it.str + (it.hasEOL ? '\n' : ''); y = ny;
      });
      out += line.trimEnd() + '\n\n';
    }
    return out.trim();
  }
  const rt = TOOLS.find(t => t.id === 'resume-improvement');
  if (rt) {
    rt.desc = 'Attach your resume (PDF / TXT) or paste text – get a score with suggestions';
    const orig = rt.render;
    rt.render = el => {
      orig(el);
      const first = el.querySelector('.card');
      first.insertAdjacentHTML('afterbegin', `<div class="fld" style="margin-bottom:14px"><span>📎 Attach resume (PDF or TXT)</span><input type="file" id="rfile" accept=".pdf,application/pdf,.txt,text/plain"><p class="note" id="rmsg" style="margin:6px 0 0">Text is read inside your browser – the file is not uploaded anywhere. Scanned/image PDFs cannot be read; paste text instead.</p></div>`);
      $('#rfile', el).addEventListener('change', async e => {
        const f = e.target.files[0]; if (!f) return;
        const msg = $('#rmsg', el); msg.textContent = 'Reading ' + f.name + '…';
        try {
          const isPdf = /\.pdf$/i.test(f.name) || f.type === 'application/pdf';
          const text = isPdf ? await pdfToText(f) : await f.text();
          if (text.length < 40) throw new Error('No readable text found (maybe a scanned PDF). Please paste the text instead.');
          $('#rt', el).value = text;
          msg.textContent = '✅ ' + f.name + ' loaded (' + text.split(/\s+/).length + ' words). Click “Analyse Resume”.';
          $('#an', el).click();
        } catch (err) { msg.textContent = '⚠️ ' + (err.message || err); }
      });
    };
  }
})();
