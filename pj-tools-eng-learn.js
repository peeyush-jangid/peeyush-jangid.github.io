/* ===== Excel · AutoCAD · HVAC practice labs (interview Q&A, practice tests, practice sheets) ===== */
(function () {
  if (!window.PJ || !PJ.learnTool) return;

  /* ====================== EXCEL ====================== */
  const XL_CMDS = PJ.rows(`
B|Ctrl+N|New workbook
B|Ctrl+S|Save workbook
B|Ctrl+C|Copy cells
B|Ctrl+V|Paste
B|Ctrl+Z|Undo
B|Ctrl+A|Select all cells (press twice inside a table)
B|Ctrl+Arrow|Jump to the last filled cell in that direction
B|Ctrl+Home|Go to A1
B|Ctrl+End|Go to the last used cell
B|F2|Edit the active cell
B|F4|Repeat last action / toggle $ in a formula reference
B|Alt+=|AutoSum the cells above or left
B|Ctrl+B|Bold
B|Ctrl+1|Format Cells dialog
B|Ctrl+Space|Select entire column
B|Shift+Space|Select entire row
B|Ctrl+F|Find
B|Ctrl+H|Find and Replace
B|Ctrl+Plus|Insert cells, rows or columns
B|Ctrl+Minus|Delete cells, rows or columns
B|Ctrl+D|Fill down from the cell above
B|Ctrl+R|Fill right
B|Enter / Tab|Move down / right after typing
I|Ctrl+T|Convert range to an Excel Table
I|Ctrl+Shift+L|Turn filters on or off
I|Ctrl+;|Insert today's date (Ctrl+Shift+; for time)
I|Alt+Enter|New line inside a cell
I|Ctrl+Shift+Arrow|Select range up to the last filled cell
I|Ctrl+E|Flash Fill – detect pattern and fill
I|Ctrl+`|Show formulas instead of values
I|Ctrl+Shift+$|Currency format
I|Ctrl+Shift+%|Percentage format
I|F5|Go To (jump to a cell or named range)
I|F12|Save As
I|Alt+H,O,I|AutoFit column width
I|Ctrl+K|Insert hyperlink
I|Shift+F11|Insert a new worksheet
I|Ctrl+PageUp/PageDown|Move between sheets
I|Alt+Down Arrow|Open drop-down list of a validated cell
I|Ctrl+Alt+V|Paste Special
P|Alt+N,V|Insert a PivotTable
P|Alt+F1|Insert a chart instantly from the selected data
P|Alt+F8|Macros list
P|Alt+F11|VBA editor
P|Ctrl+Shift+Enter|Enter an array formula (older Excel)
P|F9|Calculate now (Shift+F9 for the sheet)
P|Ctrl+[|Go to precedent cells of a formula
P|Ctrl+Shift+U|Expand / collapse the formula bar
P|Alt+A,V,V|Open Data Validation
P|Alt+A,M|Remove duplicates
P|Alt+A,S,S|Open Sort dialog
P|Alt+M,M|Create name from selection (Ctrl+Shift+F3)
P|Ctrl+Shift+F|Open Format Cells at the Font tab
P|Alt+W,F,F|Freeze Panes
`);

  const XL_QA = PJ.qa(`
F|What is a cell, row, column, worksheet and workbook?|A cell is the intersection of a row and column (e.g. B3). A worksheet is one grid of cells; a workbook is the whole file containing one or more worksheets.
F|Difference between a formula and a function?|A formula is any calculation that starts with = (e.g. =A1+B1). A function is a built-in formula like SUM, AVERAGE or IF.
F|What is the difference between relative, absolute and mixed reference?|Relative (A1) changes when copied. Absolute ($A$1) never changes. Mixed ($A1 or A$1) fixes only column or row. Press F4 to toggle.
F|What does VLOOKUP do?|Looks for a value in the first column of a table and returns a value from another column of the same row. Syntax: =VLOOKUP(value, table, col_no, FALSE).
F|Difference between COUNT, COUNTA and COUNTBLANK?|COUNT counts numbers only. COUNTA counts all non-empty cells. COUNTBLANK counts empty cells.
F|How do you freeze the top row?|View > Freeze Panes > Freeze Top Row.
F|What is the difference between Sort and Filter?|Sort rearranges the data order. Filter hides rows that do not match your condition without deleting them.
F|How do you make a chart in Excel?|Select the data and press Alt+F1 or go to Insert > Charts and choose column, line or pie.
E|VLOOKUP vs XLOOKUP vs INDEX-MATCH?|VLOOKUP searches only the first column and to the right. INDEX-MATCH works in any direction and is faster on big data. XLOOKUP (new Excel) is simpler, searches both ways and has a built-in not-found value.
E|What is a PivotTable and when do you use it?|A tool to summarize large data quickly by dragging fields – for example total sales by month and region. Select data > Insert > PivotTable.
E|Explain IF, nested IF and IFS.|IF tests one condition: =IF(A1>=40,"Pass","Fail"). Nested IF puts one IF inside another for many conditions. IFS handles several conditions in a cleaner way.
E|What is Data Validation?|It restricts what can be typed in a cell – such as a drop-down list or numbers between 1 and 100 – to prevent wrong entries.
E|What is Conditional Formatting?|Automatically changes the colour or icon of cells based on rules, e.g. highlight sales below target in red.
E|SUMIF vs SUMIFS?|SUMIF adds values meeting one condition. SUMIFS adds values meeting multiple conditions at once.
E|What are named ranges and Tables and why use them?|They give readable names to ranges (e.g. Sales) so formulas are easy to read and expand automatically when data grows.
E|How do you remove duplicates and clean messy data?|Data > Remove Duplicates; use TRIM, CLEAN, PROPER, Text to Columns, Flash Fill or Power Query for bulk cleaning.
`);

  const XL_QS = PJ.qs(`
B|Which formula adds the values in A1 to A10?|=ADD(A1:A10)|=SUM(A1:A10)|=TOTAL(A1:A10)|=PLUS(A1:A10)|2|SUM adds numbers in a range.
B|Which shortcut applies AutoSum?|Alt+=|Ctrl+=|Shift+=|F2|1|Alt+= inserts SUM for adjacent cells.
B|What does $A$1 mean?|Relative reference|Absolute reference|Mixed reference|Error|2|$ locks both column and row.
B|Which function returns the largest number?|BIG|MAX|TOP|HIGH|2|=MAX(range).
B|Which key edits the active cell?|F1|F2|F4|F9|2|F2 puts the cell in edit mode.
B|Which function counts only numeric cells?|COUNTA|COUNT|COUNTBLANK|LEN|2|COUNT counts numbers.
B|What is the intersection of a row and column called?|Cell|Sheet|Book|Range|1|Example: B3.
B|Which shortcut moves to cell A1?|Ctrl+Home|Ctrl+End|Alt+Home|Shift+Home|1|Ctrl+Home goes to A1.
B|Which function gives today's date?|=NOW()|=TODAY()|=DATE()|=DAY()|2|NOW also includes time.
B|Which symbol starts every formula?|#|@|=|&|3|Formulas begin with =.
I|Which function checks a condition and returns one of two results?|IF|VLOOKUP|SUMIF|COUNT|1|=IF(test, value_if_true, value_if_false).
I|In VLOOKUP, which value gives an exact match?|TRUE|FALSE or 0|1|-1|2|Use FALSE for exact match.
I|Which function adds cells meeting a condition?|SUMIF|SUMALL|ADDIF|COUNTIF|1|=SUMIF(range, criteria, sum_range).
I|Ctrl+T does what?|Creates a Table|Inserts time|Opens Tools|Transposes data|1|It converts the range into an Excel Table.
I|Which function joins text from two cells?|MERGE|CONCAT or &|JOINT|ADD|2|=A1&" "&B1 or CONCAT.
I|Which shortcut fills the cell above into the selected cell?|Ctrl+D|Ctrl+R|Ctrl+F|Ctrl+U|1|Ctrl+D = Fill Down.
I|What does Ctrl+E (Flash Fill) do?|Detects a pattern and fills data|Exits Excel|Edits a cell|Exports|1|Type one example and press Ctrl+E.
I|Which function removes extra spaces from text?|CLEAN|TRIM|SPACE|FIX|2|TRIM removes leading, trailing and double spaces.
P|Which function looks in any direction and has a built-in not-found result?|VLOOKUP|HLOOKUP|XLOOKUP|MATCH|3|XLOOKUP(value, lookup, return, if_not_found).
P|What is the best tool to summarise thousands of rows by month and region?|PivotTable|Filter|Freeze Panes|Data Bar|1|PivotTables summarize and group data.
P|Which function returns only the rows matching a condition as a dynamic array?|FILTER|FIND|FETCH|FORMAT|1|=FILTER(range, condition) in Microsoft 365.
P|Which combination is more flexible than VLOOKUP?|INDEX and MATCH|SUM and IF|LEFT and RIGHT|ROW and COLUMN|1|INDEX-MATCH can look left and is faster.
P|Which tool imports and transforms data from many files without formulas?|Power Query|Goal Seek|Scenario Manager|Solver|1|Data > Get Data (Power Query).
P|Which format saves a workbook with macros?|.xlsx|.xlsm|.csv|.xltx|2|.xlsm is macro-enabled.
P|Which function wraps another to show a custom message instead of #N/A or #DIV/0!?|IFERROR|ISERROR|ERROR.TYPE|IFNA only|1|=IFERROR(formula, "message").
P|What does the function =SUMPRODUCT(A1:A5,B1:B5) do?|Adds A and B|Multiplies pairs and adds the results|Counts products|Returns the largest product|2|Useful for weighted totals.
`);

  const XL_TASKS = PJ.tasks(`
B|Enter marks of 5 students in 4 subjects and calculate Total and Average for each student.|Total: =SUM(B2:E2). Average: =AVERAGE(B2:E2). Drag the fill handle down.
B|Format a table: bold header, borders, header fill colour, currency format for price column.|Select header > Ctrl+B > Fill Colour. Select all > Home > Borders > All. Price column > Ctrl+Shift+$.
B|Sort a list of employees by salary (high to low) and then filter only department 'HR'.|Data > Sort > Salary > Largest to Smallest. Ctrl+Shift+L then filter Department = HR.
B|Use AutoSum to total a monthly expense list and show the highest and lowest expense.|Alt+=. Highest =MAX(range). Lowest =MIN(range).
B|Freeze the first row and first column in a large sheet.|View > Freeze Panes > Freeze First Column, then select B2 and Freeze Panes to freeze both.
B|Create a pie chart for 4 product sales and add percentage labels.|Select data > Insert > Pie. Chart Elements > Data Labels > Percentage.
B|Calculate GST 18% and the final price for 5 items.|GST: =B2*18%. Final price: =B2+C2.
B|Print the sheet on one page in landscape with the heading row repeated.|Page Layout > Orientation Landscape, Fit to 1 page wide, Print Titles > Rows to repeat at top.
I|Give grades: >=75 'A', >=60 'B', >=40 'C', else 'Fail' using IF.|=IF(B2>=75,"A",IF(B2>=60,"B",IF(B2>=40,"C","Fail")))
I|Create a price list and use VLOOKUP to fetch the price of an item typed in another cell.|=VLOOKUP(F2,A2:B20,2,FALSE)
I|Use SUMIF to find the total sales of one salesman and COUNTIF to count how many sales he made.|=SUMIF(A:A,"Rahul",C:C) and =COUNTIF(A:A,"Rahul")
I|Add Data Validation so that the Department column only accepts HR, IT, Sales.|Select cells > Data > Data Validation > List > Source: HR,IT,Sales.
I|Highlight all sales below 50,000 in red using Conditional Formatting.|Home > Conditional Formatting > Highlight Cells Rules > Less Than > 50000 > Light Red Fill.
I|Split 'Rahul Sharma' into first name and last name columns.|Data > Text to Columns > Delimited > Space. Or Flash Fill with Ctrl+E.
I|Convert a list into a Table and add a total row.|Ctrl+T. Table Design > Total Row.
I|Use TEXT and TODAY to show today's date as 21-Nov-2026 and calculate age from date of birth with DATEDIF.|=TEXT(TODAY(),"dd-mmm-yyyy"). Age: =DATEDIF(B2,TODAY(),"Y")
P|Create a PivotTable showing total sales by month and by region, and add a slicer for Product.|Select data > Insert > PivotTable. Rows: Month, Columns: Region, Values: Sales. PivotTable Analyze > Insert Slicer > Product.
P|Replace VLOOKUP with XLOOKUP to find salary and show 'Not found' when ID is missing.|=XLOOKUP(F2,A:A,D:D,"Not found")
P|Use INDEX and MATCH to look up a value to the LEFT of the key column.|=INDEX(A:A,MATCH(F2,C:C,0))
P|Use FILTER and UNIQUE to list unique customers from the 'Delhi' branch.|=UNIQUE(FILTER(B2:B500,C2:C500="Delhi"))
P|Build a dashboard: 3 KPI cells, one column chart, one line chart, slicers.|Use PivotTables for each KPI, Insert PivotCharts, add slicers and connect them via Report Connections.
P|Import a CSV file using Power Query and remove blanks, duplicates and change data types.|Data > Get Data > From Text/CSV > Transform Data. Remove Rows > Remove Blank Rows / Duplicates. Close & Load.
P|Record a macro that formats a report (bold header, borders, autofit) and run it with a button.|View > Macros > Record. Do the formatting. Stop. Insert > Shapes, right-click > Assign Macro.
P|Calculate EMI of a loan using PMT and show a repayment schedule.|=PMT(rate/12, years*12, -loan). Use IPMT and PPMT per month to split interest and principal.
`);

  PJ.learnTool({
    id: 'excel-practice', ico: '📗', name: 'MS Excel – Shortcuts & Practice',
    desc: 'Excel shortcuts Beginner → Pro, interview Q&A, practice test and practice sheet (formulas are in Excel Formulas tool)',
    cmds: XL_CMDS, cmdHead: ['Shortcut', 'What it does'], ph: 'Search e.g. sum, freeze, pivot, Ctrl+T…',
    qa: XL_QA, qs: XL_QS, tasks: XL_TASKS
  });

  /* ====================== AUTOCAD ====================== */
  const CAD_QA = PJ.qa(`
F|What is AutoCAD?|Computer-Aided Design software by Autodesk used to prepare 2D drawings and 3D models for architecture, HVAC, civil, mechanical and electrical work. Files are saved as .dwg.
F|What is the difference between Model Space and Paper Space?|Model Space is where you draw the actual object at full size (1:1). Paper Space (Layout tab) is the sheet where you place viewports, title block, scale and plot.
F|What are Layers and why are they important?|Layers organize drawing objects by type (walls, duct, pipe, dimension) with their own colour, linetype and visibility, making drawings easy to edit and print.
F|What is the use of Ortho, Polar and Object Snap?|Ortho (F8) restricts lines to horizontal/vertical, Polar (F10) snaps to set angles, Object Snap (F3) snaps to endpoints, midpoints, centres and intersections.
F|What is the difference between Trim and Extend?|Trim cuts objects at a cutting edge. Extend lengthens objects up to a boundary edge.
F|How do you draw a line of exact length and angle?|Type L, click a start point, then enter distance and angle using polar input: 5000<45. Or use Dynamic Input.
F|What is the difference between DWG, DXF and PDF?|DWG is the native drawing file. DXF is an exchange format for other CAD programs. PDF is for viewing and sharing/printing.
E|What is a Block and what is a Dynamic Block?|A Block is a named group of objects reused across drawings (door, AHU, diffuser). A Dynamic Block can change size, flip or show variations through grips and parameters.
E|What is an Xref?|External reference – a drawing attached to another drawing without copying, so updates in the source drawing reflect everywhere. Used to attach architectural plans for HVAC drawings.
E|How do you set up a plot to the correct scale?|Make a Layout, create a viewport, set the viewport scale (e.g. 1:100), lock it, assign the plot style (CTB), choose paper size and plot to PDF.
E|What is annotative scale?|A feature that makes text, dimensions and hatches automatically adjust to the viewport scale so they print at the correct height.
E|What is a plot style (CTB/STB)?|A table that controls line colour, lineweight and screening when plotting. CTB works by colour, STB by named style.
P|What are Fields, Data Extraction and Sheet Set Manager?|Fields show live data such as sheet numbers. Data Extraction exports block attributes to tables or Excel (e.g. BOQ). Sheet Set Manager organizes many layouts, title blocks and plots a full drawing set.
P|How do you automate repetitive tasks in AutoCAD?|Use Action Recorder, Scripts (.scr), Tool Palettes, custom aliases in acad.pgp, AutoLISP routines or the Express Tools.
P|How do you reduce a heavy drawing and fix errors?|Use PURGE, AUDIT, OVERKILL to delete unused/duplicate objects, WBLOCK to save clean content, RECOVER for corrupted files, and detach unused xrefs.
`);

  const CAD_QS = PJ.qs(`
B|Which command alias draws a line?|C|L|PL|LI|2|L = LINE, C = CIRCLE, PL = PLINE.
B|Which function key toggles Ortho mode?|F3|F8|F9|F10|2|F8 = Ortho, F3 = Osnap, F10 = Polar tracking.
B|Which command makes a parallel copy of an object at a distance?|OFFSET|COPY|ARRAY|MOVE|1|OFFSET (O).
B|Alias for TRIM is:|T|TR|TRM|X|2|TR = TRIM, EX = EXTEND, X = EXPLODE.
B|Which command draws a rectangle?|REC|BOX|SQ|R|1|REC = RECTANG.
B|Which command displays the whole drawing on screen?|ZOOM Extents|PAN|REGEN|LIMITS|1|Type Z, Enter, E, Enter.
B|Which command breaks a block or polyline into separate objects?|BREAK|EXPLODE|JOIN|DETACH|2|EXPLODE (X).
B|What is the extension of an AutoCAD drawing?|.dxf|.dwg|.dwt|.dws|2|.dwg is the native format.
I|Which command creates an array in a rectangular or polar pattern?|ARRAY|COPY|MIRROR|SCALE|1|ARRAY (AR).
I|Which shortcut opens the Properties palette?|Ctrl+1|Ctrl+2|Ctrl+3|Ctrl+9|1|Ctrl+1 = Properties, Ctrl+2 = DesignCenter, Ctrl+3 = Tool Palettes.
I|Which command creates a block?|BLOCK (B)|INSERT (I)|WBLOCK only|GROUP|1|B = create block, I = insert block, W = write block to a file.
I|Where do you set the plotting scale for a drawing sheet?|Model space only|Layout viewport|Layer manager|Units|2|Viewport scale defines plot scale.
I|Which command matches the properties of one object to another?|MATCHPROP (MA)|COPY|PROPERTIES|OFFSET|1|Like Format Painter.
I|Which command joins connected lines into one polyline?|PEDIT > Join|MERGE|LINK|CONNECT|1|PE then J, or the JOIN command (J).
I|What does the FILLET command do?|Rounds/joins two lines with a radius|Cuts a line|Offsets a line|Mirrors an object|1|FILLET (F) with radius 0 makes sharp corners.
I|Which command is used to dimension a straight horizontal distance?|DIMLINEAR (DLI)|DIMRADIUS|DIMANGULAR|DIMALIGNED only|1|DIMLINEAR measures horizontal or vertical distance.
P|Which command removes unused layers, blocks and styles?|PURGE|ERASE|AUDIT|RECOVER|1|PURGE (PU).
P|Which command attaches another drawing as external reference?|XREF|INSERT|IMPORT|OPEN|1|XREF (XR) > Attach DWG.
P|Which file type stores a CAD template with settings?|.dwg|.dwt|.dxf|.bak|2|.dwt is a drawing template.
P|Which feature automatically scales text for each viewport scale?|Annotative scale|Regen|Layer freeze|Block|1|Annotative objects adapt to the viewport scale.
P|Which command creates a BOQ table from block attributes?|DATAEXTRACTION|ATTEDIT|FIELD|SCALELISTEDIT|1|DATAEXTRACTION exports attribute data to table or Excel.
`);

  const CAD_TASKS = PJ.tasks(`
B|Set units to millimetres and draw a rectangle 6000 × 4000 as a room using RECTANG.|UNITS > Millimeters. REC > click first corner > type @6000,4000.
B|Create layers: WALL (red), DOOR (green), DIM (blue), TEXT (white), DUCT (cyan).|LAYER (LA) > New Layer > name and colour each.
B|Make 230 mm thick walls from a line plan using OFFSET and TRIM.|O > 230 > click line > click side. Use TR to clean corners.
B|Draw a circle radius 500 and make a polar array of 6 around a centre point.|C then AR > Polar > select circle > centre point > items 6.
B|Add linear dimensions to the room and set text height 150.|DIMSTYLE > Modify > Text height 150. DLI for horizontal and vertical dimensions.
I|Create a door block (900 mm) and insert it in 3 places with different rotations.|Draw door > B > name DOOR1 > base point at hinge. I > DOOR1 > insert with rotation.
I|Make a floor plan with two rooms and apply hatch pattern ANSI31 to walls.|H > Pick internal point > Pattern ANSI31 > scale 50.
I|Create a Layout A3 with a title block and a viewport at scale 1:50.|Layout tab > Page Setup A3 > MV viewport > select viewport > set scale 1:50 > lock viewport.
I|Draw a rectangular duct layout with centre line and dimension in a separate layer.|Use PL on DUCT layer, OFFSET centre line by half width, add dimension on DIM layer.
I|Attach an architectural plan as xref and draw HVAC layers over it.|XR > Attach DWG > Insertion 0,0,0 > Create new layers for HVAC above.
P|Create a dynamic block of a window with width options 600/900/1200.|BEDIT > add Linear parameter and Stretch action > Value Set 600,900,1200.
P|Create a BOQ table of all AHU blocks using Data Extraction.|Add attributes (ATTDEF) to the block. DATAEXTRACTION > select drawing > choose block and properties > output to table or Excel.
P|Set up a Sheet Set with 5 drawings having automatic sheet number fields.|SHEETSET > New Sheet Set > add sheets > insert fields for sheet number and title in the title block.
P|Write an AutoLISP command that draws a 100 × 100 square.|(defun c:SQ100 () (command "_.RECTANG" pause "@100,100")) – load via APPLOAD and type SQ100.
P|Plot a drawing to PDF with line weights using a CTB file.|Ctrl+P > Printer DWG To PDF > paper size > plot style table (CTB) > Plot area Layout > Plot.
`);

  PJ.learnTool({
    id: 'autocad-practice', ico: '📐', name: 'AutoCAD – Practice Lab',
    desc: 'AutoCAD interview Q&A, practice test and practice sheet (commands list is in AutoCAD Resources)',
    qa: CAD_QA, qs: CAD_QS, tasks: CAD_TASKS, cat: 'learn'
  });

  /* ====================== HVAC ====================== */
  const HV_CMDS = PJ.rows(`
B|1 TR = 12,000 BTU/h = 3.517 kW|Ton of Refrigeration conversion
B|kW × 0.2843 = TR|Convert kW to TR (or kW ÷ 3.517)
B|1 kW = 3,412 BTU/h|Power to BTU/h
B|1 CFM = 1.699 m3/h = 0.4719 L/s|Airflow units
B|1 inch = 25.4 mm · 1 ft = 304.8 mm|Duct size conversion
B|Duct area (sq ft) = CFM ÷ Velocity (FPM)|Required duct cross-section
B|Velocity (FPM) = CFM ÷ Area (sq ft)|Air speed through a duct
B|Rule of thumb: 400 CFM per TR|Supply air quantity for comfort cooling
I|CFM = Volume (cu ft) × ACH ÷ 60|Airflow from air changes per hour
I|Sensible heat (BTU/h) = 1.08 × CFM × ΔT (°F)|Sensible cooling/heating load of air
I|Latent heat (BTU/h) = 0.68 × CFM × ΔW (gr/lb)|Moisture removal load
I|Total heat (BTU/h) = 4.5 × CFM × Δh (BTU/lb)|Total air-side load
I|Round duct dia from area: d = √(4A ÷ π)|Round duct size
I|Equal friction rule ≈ 0.08–0.1 in.wg per 100 ft|Common duct sizing design value
I|Fresh air = persons × CFM per person|Ventilation requirement
I|COP = Cooling capacity (kW) ÷ Compressor power (kW)|Efficiency
I|EER = 3.412 × COP|COP to EER
P|GPM = TR × 24 ÷ ΔT (°F)|Chilled water flow (2.4 GPM/TR at ΔT 10°F)
P|Flow (L/s) = kW ÷ (4.186 × ΔT °C)|Chilled water flow in SI
P|Condenser heat = Evaporator load + Compressor work|Heat rejection of a chiller
P|Fan law: Power ∝ (Speed)³|VFD energy saving
P|Fan law: Flow ∝ Speed; Pressure ∝ Speed²|Affinity laws
P|Total static pressure = Duct losses + Fittings + Filters + Coil + Grille|Fan selection
P|Pipe velocity limit ≈ 1.2–2.4 m/s|Chilled water pipe sizing
P|Approach = Leaving water temp − Wet-bulb temp|Cooling tower performance
P|Range = Hot water temp − Cold water temp|Cooling tower performance
P|kW/TR = Power input (kW) ÷ Cooling load (TR)|Chiller efficiency indicator
`);

  const HV_QS = PJ.qs(`
B|1 TR equals how many BTU/h?|3,517|12,000|24,000|1,200|2|1 TR = 12,000 BTU/h.
B|1 TR equals approximately how many kW?|1.0|2.5|3.517|5.0|3|1 TR = 3.517 kW.
B|Which refrigeration cycle component raises the pressure of refrigerant vapour?|Evaporator|Condenser|Compressor|Expansion valve|3|The compressor increases pressure and temperature.
B|Which component rejects heat to the outside?|Evaporator|Condenser|Filter|Damper|2|The condenser rejects heat to air or water.
B|What does CFM stand for?|Cubic feet per minute|Cooling for machine|Chiller flow meter|Cubic fan metre|1|It measures airflow volume.
B|Which device controls airflow in a duct?|Damper|Strainer|Trap|Gauge|1|Volume Control Dampers (VCD) balance airflow.
B|VRF stands for:|Variable Refrigerant Flow|Variable Room Fan|Valve Regulated Flow|Voltage Rated Fan|1|One outdoor unit serves multiple indoor units.
B|Which instrument measures dry-bulb temperature?|Thermometer|Manometer|Anemometer|Hygrometer|1|A hygrometer measures humidity; an anemometer measures air velocity.
I|Airflow (CFM) = ?|Area × Velocity (FPM)|Area ÷ Velocity|Velocity ÷ Area|Area + Velocity|1|CFM = sq ft × FPM.
I|What is the typical supply air per TR for comfort cooling?|100 CFM|200 CFM|400 CFM|800 CFM|3|Approx 400 CFM per TR.
I|EER ≈ ?|COP × 3.412|COP ÷ 3.412|COP + 3.412|COP − 3.412|1|EER = 3.412 × COP.
I|Sensible heat formula (BTU/h) is:|1.08 × CFM × ΔT|4.5 × CFM|0.68 × CFM × ΔW|500 × GPM|1|ΔT in °F.
I|Which duct sizing method is most common for comfort AC?|Equal friction|Static regain|T-method only|Random|1|Equal friction is simple and widely used.
I|Which chart is used to read dry-bulb, wet-bulb, dew point and humidity?|Moody chart|Psychrometric chart|Mollier only|Pareto|2|Psychrometric chart.
I|What is the function of a filter drier?|Removes moisture and particles|Raises pressure|Cools air|Measures flow|1|It protects the expansion valve and compressor.
I|What is sub-cooling?|Cooling liquid refrigerant below its condensing temperature|Heating vapour|Cooling air|Freezing water|1|It improves system capacity.
P|By what percentage does fan power drop if speed is reduced to 80%?|20%|36%|48.8%|64%|3|Power ∝ speed³ → 0.8³ = 0.512 → 48.8% saving.
P|Chilled water flow rate at ΔT 10°F is approx. how many GPM per TR?|1.2|2.4|4.8|10|2|GPM = TR × 24 ÷ ΔT.
P|Which chiller is generally more efficient for large loads?|Air-cooled|Water-cooled|Window AC|Split AC|2|Water-cooled chillers have lower kW/TR.
P|What happens if a cooling tower's approach is small?|Tower is performing very well|Tower is failing|Fan is off|Water is hot|1|Approach = cold water temp − wet-bulb temp.
P|What is the purpose of balancing valves in a chilled water system?|Give each coil the designed flow|Heat the water|Store water|Remove air|1|Hydronic balancing ensures proper distribution.
P|Which indicates chiller efficiency?|kW/TR|CFM|FPM|BTU only|1|Lower kW/TR = more efficient.
P|What does low-pressure cut-out protect?|Compressor from low suction pressure|Fan motor|Filter|Duct|1|It stops the compressor when suction pressure is too low.
P|What is the main purpose of pre-commissioning checks?|Verify installation before start-up|Paint the pipes|Order material|Remove old units|1|Includes leak test, flushing, megger, alignment, valve and damper checks.
`);

  const HV_TASKS = PJ.tasks(`
B|Convert 5 TR into kW.|5 × 3.517 = 17.59 kW
B|Convert 2.5 TR into BTU/h.|2.5 × 12,000 = 30,000 BTU/h
B|Convert 35.17 kW into TR.|35.17 ÷ 3.517 = 10 TR
B|Three VRF indoor units are 2.2 kW, 2.8 kW and 3.6 kW. Total capacity in TR?|2.2 + 2.8 + 3.6 = 8.6 kW. 8.6 ÷ 3.517 = 2.45 TR
B|A split AC is rated 24,000 BTU/h. Find TR and kW.|24,000 ÷ 12,000 = 2 TR. 2 × 3.517 = 7.03 kW
I|A hall needs 10 TR. Find supply air using 400 CFM/TR.|10 × 400 = 4,000 CFM
I|2,000 CFM flows through a duct of 1.5 sq ft. Find velocity.|2000 ÷ 1.5 = 1,333 FPM
I|A room 20 ft × 15 ft × 10 ft needs 12 air changes per hour. Find CFM.|Volume = 3,000 cu ft. CFM = 3000 × 12 ÷ 60 = 600 CFM
I|Find duct area for 1,500 CFM at 1,000 FPM and the equivalent round duct diameter.|Area = 1.5 sq ft = 216 sq in. d = √(4 × 1.5 ÷ π) = 1.38 ft ≈ 16.6 inch
I|Find sensible heat load of 1,000 CFM cooled by 20°F.|1.08 × 1000 × 20 = 21,600 BTU/h (1.8 TR)
P|A chiller gives 10 kW cooling with 2.5 kW input. Find COP and EER.|COP = 10 ÷ 2.5 = 4. EER = 3.412 × 4 = 13.65
P|Find chilled water flow (GPM) for 100 TR at ΔT 10°F.|GPM = 100 × 24 ÷ 10 = 240 GPM
P|Find chilled water flow in L/s for 351.7 kW and ΔT 5°C.|351.7 ÷ (4.186 × 5) = 16.8 L/s
P|A fan speed is reduced to 80% using a VFD. Find power saving.|Power ratio = 0.8³ = 0.512 → saving ≈ 48.8%
P|A 100 TR chiller has COP 5. Find condenser heat rejection.|Evaporator load = 351.7 kW. Compressor work = 351.7 ÷ 5 = 70.3 kW. Condenser heat = 422 kW
P|Find fresh air for 40 persons at 10 CFM per person.|40 × 10 = 400 CFM
`);

  PJ.learnTool({
    id: 'hvac-practice', ico: '❄️', name: 'HVAC – Formulas & Practice',
    desc: 'HVAC formula cheat-sheet, practice test and numerical practice sheet with solutions',
    cmds: HV_CMDS, cmdHead: ['Formula / Rule', 'Use'], cmdTab: 'Formulas', ph: 'Search e.g. CFM, COP, TR, VFD…',
    qs: HV_QS, tasks: HV_TASKS, sheetIntro: 'Solve on paper first, then tick the task. Show answers to check the working.'
  });
})();
