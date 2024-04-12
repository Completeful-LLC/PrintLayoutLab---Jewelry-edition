

import { prefixNCK, prefixRNG, oneLineNck, oneLineRNG, threeLineNck, fourLineNck, validSkus, applyFontRule } from './precheck_config.js';  
  
    let csvUploaded = false;  
    let parsedCsvData;  
    let rowCount = 0;
    
    // upload csv
    function handleFileSelect(evt) {  
        const file = evt.target.files[0];  
        Papa.parse(file, {  
            complete: function (results) {  
                parsedCsvData = results.data;  
                $('#output').html(generateTableHtml(results.data));  
                $('#preview-modal').modal('toggle');  
                csvUploaded = true;  
            }  
        });  
    }

    // splitting personalizations for table
        function getPersonalization(options) {
            // split by commas    
            const lines = options.split(/,\s*/);    
            const personalizationKeywords = ['Personalization:', 'Personalization', 'Custom Name:', 'Name 1:', 'Name 2:', 'Name 3:', 'Name 4:', 'Custom Name Top:', 'Custom Name Bottom:',   
            'Left Inscription:', 'Middle Inscription:', 'Right Inscription:', 'Outside Inscription:', 'Inside Inscription:', 'InsideTextLine1:'];    
          
            const personalizations = [];    
            let personalizationLineCount = 0;    
            
            for (const line of lines) {    
                for (const keyword of personalizationKeywords) {    
                    if (line.includes(keyword)) {    
                        const startPos = line.indexOf(keyword) + keyword.length;    
                        const personalization = line.slice(startPos).replace(/(^"|"$|\s+,)/g, '').trim().replace(/,(\s*)$/, '').replace(/\s+,$/, '').replace(/\s+(?=")/, '');
        
                        if (keyword === 'Inside Inscription:') {
                            personalizations[1] = personalization;
                            personalizationLineCount++;
                        } else if (keyword === 'Name 1:' || keyword === 'Name 2:' || keyword === 'Name 3:' || keyword === 'Name 4:' || keyword === 'Custom Name Top:' || keyword === 'Custom Name Bottom:' 
                        || keyword === 'Left Inscription:' || keyword === 'Middle Inscription:' || keyword === 'Right Inscription:' || keyword === 'InsideTextLine1:') {  
        
                            personalizations.push(personalization);  
                            personalizationLineCount++;  
                        } else {  
                            const splitPersonalization = personalization.split(/["']\s*[,]\s*["']|["']\s*["']\s*|\r\n|\n|\r/).map(val => val.trim());  
                            personalizationLineCount = splitPersonalization.length;  
                            if (personalizationLineCount === 1) {  
                                personalizations.push(splitPersonalization[0], "");  
                            } else if (personalizationLineCount > 1) {  
                                personalizations.push(...splitPersonalization);  
                            }  
                        }  
                    }  
                }  
            }  
            return { personalizations, personalizationLineCount };  
        }
        
         

    // generating table
    function generateTableHtml(data) {  
        const indicesToDisplay = [0, 1, 2, 3]; 
        const maxPersonalizationLength = 150;
        rowCount = 0;  
        let tableHtml = '<table class="table table-bordered">';  
      
        for (let i = 0; i < data.length; i++) {  
            const row = data[i]; 
            if (i !== 0 && row[2] !== undefined) {
                row[2] = row[2].toUpperCase();
            }  
            if (i === 0) {  
                tableHtml += '<thead><tr>';  
                for (let j = 0; j < row.length; j++) {  
                    if (indicesToDisplay.includes(j)) {  
                        tableHtml += '<th>' + row[j] + '</th>';  
                    }  
                }  
                tableHtml += '</tr></thead><tbody>';  
            } else {  
                if (row[2] === "") {  
                    tableHtml += '<tr class="separator"><td colspan="6"></td></tr>';  
                    continue; 
                } else if (row.includes("Discount")) {  
                    tableHtml += '<tr class="separator"><td colspan="6"></td></tr>';  
                    continue;     
                }  
                
                rowCount++;  
                tableHtml += '<tr>';  
                for (let j = 0; j < row.length; j++) {
                    const sku = row[2]; 

                    const options = row[3];  
  
                    if (options && (options.includes(', print_url:') || options.includes(', print_url_1:'))) {  
                        row[2] = "CLABEL";  
                    }
                    
                    const isOneLine = oneLineRNG.some(suffix => (prefixRNG + suffix) === sku) ||oneLineNck.some(suffix => (prefixNCK + suffix) === sku); 
                    const isThreeLine = threeLineNck.some(suffix => (prefixNCK + suffix) === sku);  
                    const isFourLine = fourLineNck.some(suffix => (prefixNCK + suffix) === sku);

                    if (indicesToDisplay.includes(j)) {  
                        if (j === 2) {  
                            const sku = row[j];  
                            console.log("Current SKU:", sku);  
                            console.log("Is SKU valid?", sku === "CLABEL" || validSkus.includes(sku));

                            const { personalizations, personalizationLineCount } = getPersonalization(row[3]);  
  
                            if (personalizations.length === 2 && personalizationLineCount === 2) {
                            }  
                            console.log("Personalization line count:", personalizationLineCount);  
      
                            let icon;

                            if (sku === "CLABEL") {  
                                icon = goodCheckUrl;
                            } else if (!validSkus.includes(sku)) {  
                                icon = unknownDesignUrl; 
                            } else if ((personalizationLineCount === 0 || personalizationLineCount > 2) && !isThreeLine && !isFourLine) {  
                                icon = errorCheckUrl;  
                            } else if (personalizationLineCount === 1 && isOneLine) {  
                                icon = goodCheckUrl;  
                            } else if (personalizationLineCount === 2) {  
                                icon = goodCheckUrl;  
                            } else if (personalizationLineCount === 3 && isThreeLine) {  
                                icon = goodCheckUrl;
                            } else {  
                                icon = missingCheckUrl;  
                            }  
                             
                            console.log("Chosen icon URL:", icon);  
      
                            tableHtml += '<td><div style="display: flex; align-items: center;"><img src="' + icon + '" class="icon2" width="25" height="25" alt="Check Logo"><span>' + sku + '</span></div></td>';  
                        } else if (j === 3) {  
                            const personalizations = getPersonalization(row[j]).personalizations;  
                            const noPersonalization = personalizations.length === 0;  
                              
                            // No personalization, no input lines  
                            if (noPersonalization) {  
                                tableHtml += '<td></td><td></td>';  
                                continue;  
                            }
                            row[3] = applyFontRule(row[3]);
                            const startsWithWood = sku.startsWith("WOOD") || sku.startsWith("wood");

                            if (isOneLine) {  
                                if (personalizations.length === 0) {  
                                    tableHtml += '<td><input type="text" class="personalization-input line1-input" value="" data-row-index="' + i + '"></td>';  
                                } else {  
                                    tableHtml += '<td><input type="text" class="personalization-input line1-input" value="' + personalizations[0] + '" data-row-index="' + i + '"></td>';  
                                }  
                                tableHtml += '<td style="display:none;"><input type="text" class="personalization-input line2-input" value="" data-row-index="' + i + '"></td>'; // adds a hidden line 2 input
                                tableHtml += '<td style="display:none;"><input type="text" class="personalization-input line3-input" value="" data-row-index="' + i + '"></td>'; // adds a hidden line 3 input  
                                tableHtml += '<td style="display:none;"><input type="text" class="personalization-input line4-input" value="" data-row-index="' + i + '"></td>'; // adds a hidden line 4 input  
                            } else if (isThreeLine || startsWithWood) {  
                                tableHtml += '<td><input type="text" class="personalization-input line1-input" value="' + (personalizations[0] || '') + '" data-row-index="' + i + '"></td>';  
                                tableHtml += '<td colspan="3"><input type="text" class="personalization-input line2-input" value="' + (personalizations[1] || '') + '" data-row-index="' + i + '"></td>';  
                                tableHtml += '</tr><tr>';  
                                tableHtml += '<td colspan="3"></td><td><input type="text" class="personalization-input line3-input" value="' + (personalizations[2] || '') + '" data-row-index="' + i + '"></td>';  
                                tableHtml += '<td style="display:none;"><input type="text" class="personalization-input line4-input" value="" data-row-index="' + i + '"></td>'; // adds a hidden line 4 input  
                            } else if (isFourLine) {  
                                tableHtml += '<td><input type="text" class="personalization-input line1-input" value="' + (personalizations[0] || '') + '" data-row-index="' + i + '"></td>';  
                                tableHtml += '<td><input type="text" class="personalization-input line2-input" value="' + (personalizations[1] || '') + '" data-row-index="' + i + '"></td>';  
                                tableHtml += '</tr><tr>';  
                                tableHtml += '<td colspan="2"></td><td><input type="text" class="personalization-input line3-input" value="' + (personalizations[2] || '') + '" data-row-index="' + i + '"></td>';  
                                tableHtml += '<td><input type="text" class="personalization-input line4-input" value="' + (personalizations[3] || '') + '" data-row-index="' + i + '"></td>';  
                            } else {  
                                if (personalizations.length === 1) {  
                                    tableHtml += '<td><input type="text" class="personalization-input line1-input" value="' + personalizations[0] + '" data-row-index="' + i + '"></td><td><input type="text" class="personalization-input line2-input" value="" data-row-index="' + i + '" data-two-line="true"></td>';  
                                } else {  
                                    tableHtml += '<td><input type="text" class="personalization-input line1-input" value="' + personalizations[0] + '" data-row-index="' + i + '"></td><td><input type="text" class="personalization-input line2-input" value="' + personalizations[1] + '" data-row-index="' + i + '" data-two-line="true"></td>';  
                                }  
                                tableHtml += '<td style="display:none;"><input type="text" class="personalization-input line3-input" value="" data-row-index="' + i + '"></td>'; // adds a hidden line 3 input  
                                tableHtml += '<td style="display:none;"><input type="text" class="personalization-input line4-input" value="" data-row-index="' + i + '"></td>'; // adds a hidden line 4 input  
                            }  
                             
                        } else {  
                            tableHtml += '<td>' + row[j] + '</td>';  
                        }  
                    }  
                }

                // delete btn  
                if (row.join('').trim() !== '') { 
                    // tableHtml += '<td><img src="/static/images/add.svg" width="25" height="25" class="icon d-inline-block align-center delete-btn" alt="Copy Button" data-toggle="tooltip" data-placement="top" title="copy line" data-row-index="' + i + '"></td></tr>';  
                    tableHtml += '<td><img src="/static/images/minus.svg" width="25" height="25" class="icon d-inline-block align-center delete-btn" alt="Delete Button" data-toggle="tooltip" data-placement="top" title="delete line" data-row-index="' + i + '"></td></tr>';  
                } else {  
                    tableHtml += '<td></td></tr>';  
                }
                
        // non-editable CSV line view  
        const itemOptionsText = row[3] !== undefined ? row[3] : '';    
        let visibilityStyle = "";    
                
        if (itemOptionsText.length > maxPersonalizationLength) {    
            visibilityStyle = "display: none;";    
        }    
                
        tableHtml += '<tr><td colspan="4" style="font-size: 12px; color: #999; padding-top: 0; text-align: left;' + visibilityStyle + '">';  
        tableHtml += '<div class="csv-line" data-row-index="' + i + '">' + itemOptionsText + '</div>';  
        tableHtml += '</td></tr>';   
        }  
    }  
    tableHtml += '</tbody></table>';  
    return tableHtml;  
} 
      
    $("#csv-file").on("change", handleFileSelect);  
      
    $("#preview-button").on("click", function() {  
        if (csvUploaded) {  
            $('#preview-modal').modal('toggle');  
        } else {  
            alert("Please upload a CSV file first.");  
        }  
    });   
      
    let saveButtonClicked = false;  
      
    $('#save-changes-btn').on('click', function () {  
        saveButtonClicked = true;  
        $('#preview-modal').modal('hide');  
    });  
      
    $('#preview-modal').on('hidden.bs.modal', function () {  
        if (saveButtonClicked) {  
            const line1Inputs = document.getElementsByClassName('line1-input');  
            const line2Inputs = document.getElementsByClassName('line2-input');  
            const line3Inputs = document.getElementsByClassName('line3-input');  
            const line4Inputs = document.getElementsByClassName('line4-input');  
      
            for (let i = 0; i < line1Inputs.length; i++) {    
                const rowIndex = parseInt(line1Inputs[i].getAttribute('data-row-index'));    

                if (parsedCsvData[rowIndex] === null) {  
                    continue;  
                }  
                  
                const line1Value = line1Inputs[i].value.trim();  
                const line2Value = line2Inputs[i].value.trim(); 
                const line3Value = line3Inputs[i].value.trim();  
                const line4Value = line4Inputs[i].value.trim(); 

                const row = parsedCsvData[rowIndex]; 

                function getMonthAbbreviationFromItemName(itemName) {  
                    const monthNames = [  
                        'January', 'February', 'March', 'April', 'May', 'June',  
                        'July', 'August', 'September', 'October', 'November', 'December'  
                    ];  
                    const monthAbbreviations = {  
                        'January': 'NCKJAN',  
                        'February': 'NCKFEB',  
                        'March': 'NCKMAR',  
                        'April': 'NCKAPR',  
                        'May': 'NCKMAY',  
                        'June': 'NCKJUN',  
                        'July': 'NCKJUL',  
                        'August': 'NCKAUG',  
                        'September': 'NCKSEP',  
                        'October': 'NCKOCT',  
                        'November': 'NCKNOV',  
                        'December': 'NCKDEC'  
                    };  
                    for (const month of monthNames) {  
                        if (itemName.includes(month)) {  
                            return monthAbbreviations[month];  
                        }  
                    }  
                    return '';  
                }   

                const itemName = row[4];
                const monthAbbreviation = getMonthAbbreviationFromItemName(itemName);  
              
                // Update the SKU based on the month abbreviation  
                if (monthAbbreviation && row[2].startsWith('NCK')) {  
                    row[2] = monthAbbreviation + row[2];  
                } 

                if (line1Value && line2Value && !line3Value && !line4Value && row[2] === "JMUG11WBUVPPSFAVCHUVP") {  
                    row[2] = "JMUG11WBUVPPS2FAVCHUVP";  
                } 
                if (line1Value && line2Value && line3Value && !line4Value && row[2] === "JMUG11WBUVPPSFAVCHUVP") {  
                    row[2] = "JMUG11WBUVPPS3FAVCHUVP";  
                } 
                if (line1Value && line2Value && line3Value && line4Value && row[2] === "JMUG11WBUVPPSFAVCHUVP") {  
                    row[2] = "JMUG11WBUVPPS4FAVCHUVP";
                }
            
                const optionsIndex = 3;  
      
                const originalOptions = row[optionsIndex];  
                let newOptions;  
  
                // change sku for split options
                if (originalOptions.includes('OPTIONS: WHITE BACKGROUND') && row[2] === 'DSWCLR001UVPPSCFDNPUVP') { 
                    row[2] = 'DSWCLR001UVPPSCFDNPUVPWB';
                }  

                if (originalOptions.includes('Name 1:')) {  
                    newOptions = originalOptions.replace(/(Name 1:)([^,]*)(,|$)/, `$1${line1Value}$3`);  
                    newOptions = newOptions.replace(/(Name 2:)([^,]*)(,|$)/, `$1${line2Value}$3`);     
                    newOptions = newOptions.replace(/(Name 3:)([^,]*)(,|$)/, `$1${line3Value}$3`);            
                    newOptions = newOptions.replace(/(Name 4:)([^,]*)(,|$)/, `$1${line4Value}$3`);      

                } else if (originalOptions.includes('Custom Name:')) { 
                    newOptions = applyFontRule(originalOptions); 
                } else {  
                    const topMatch = originalOptions.match(/(Custom Name Top:)([^,]*)(,|$)/);  
                    const bottomMatch = originalOptions.match(/(Custom Name Bottom:)([^,]*)(,|$)/);  
                  
                    if (topMatch && bottomMatch) {      
                        newOptions = originalOptions.replace(/(Custom Name Top:)([^,]*)(,|$)/, `Personalization:${line1Value.trim()}\n${line2Value.trim()}`);      
                        newOptions = newOptions.replace(/(Custom Name Bottom:)([^,]*)(,|$)/, `Personalization:${line1Value.trim()}\n${line2Value.trim()}`);      
                        newOptions = newOptions.replace(/,\s*font:\s*Shelby Bold/, '');
                    
                    } else {  
                        const leftInscriptionMatch = originalOptions.match(/(Left Inscription:)([^,]*)(,|$)/);  
                        const middleInscriptionMatch = originalOptions.match(/(Middle Inscription:)([^,]*)(,|$)/);  
                        const rightInscriptionMatch = originalOptions.match(/(Right Inscription:)([^,]*)(,|$)/);  
      
                        if (leftInscriptionMatch && middleInscriptionMatch && rightInscriptionMatch) {  
                            newOptions = originalOptions.replace(/(Left Inscription:)([^,]*)(,|$)/, `$1${line3Value}$3`);  
                            newOptions = newOptions.replace(/(Middle Inscription:)([^,]*)(,|$)/, `$1${line1Value}$3`);  
                            newOptions = newOptions.replace(/(Right Inscription:)([^,]*)(,|$)/, `$1${line2Value}$3`);  
                        } else {  
                            const leftInscriptionMatch = originalOptions.match(/(Left Inscription:)([^,]*)(,|$)/);  
                            const rightInscriptionMatch = originalOptions.match(/(Right Inscription:)([^,]*)(,|$)/);  
                          
                            if (leftInscriptionMatch && rightInscriptionMatch) {  
                                newOptions = originalOptions.replace(/(Left Inscription:)([^,]*)(,|$)/, `$1${line1Value}$3`);  
                                newOptions = newOptions.replace(/(Right Inscription:)([^,]*)(,|$)/, `$1${line2Value}$3`);  
                            } else {    
                                const personalizationMatch = originalOptions.match(/(Personalization:)([^,]*)(,|$)/);    
                                
                                // line inputs

                                const orderNumber = row[0];

                                if (orderNumber.startsWith("ML")) {  // MintLily 
                                    if (personalizationMatch) {  
                                        const updatedPersonalization = [line1Value, line2Value].filter(val => val).join('\n');  
                                        newOptions = originalOptions.replace(/(Personalization:)([^,]*)(,|$)/, `$1${updatedPersonalization}$3`);  
                                    } else {  
                                        newOptions = originalOptions;  
                                    }  
                                } else {  
                                    if (personalizationMatch) {  
                                        const updatedPersonalization = [line1Value, line2Value, line3Value, line4Value].filter(val => val).join('\n');  
                                        newOptions = originalOptions.replace(/(Personalization:)([^,]*)(,|$)/, `$1${updatedPersonalization}$3`);  
                                    } else {  
                                        newOptions = originalOptions;  
                                    }  
                                }  
                                  
                            }  
                        } 
                    }
                }
                row[optionsIndex] = newOptions;  
            }      
      
            const updatedCsv = Papa.unparse(parsedCsvData.filter(row => row !== null));  

      
            const blob = new Blob([updatedCsv], { type: "text/csv;charset=utf-8;" });  
            const downloadLink = document.createElement("a");  
            const url = URL.createObjectURL(blob);  
            downloadLink.href = url;  
            downloadLink.setAttribute("download", "updated_csv.csv");  
            document.body.appendChild(downloadLink);  
            downloadLink.click();  
            document.body.removeChild(downloadLink);  
      
            saveButtonClicked = false;  
        }  
    });  

    $(document).ready(function(){ 
        $('[data-toggle="tooltip"]').tooltip();   
      });

      $(document).on('click', '.delete-btn', function () {  
        const rowIndex = parseInt($(this).data('row-index'));  
        parsedCsvData[rowIndex] = null;  
        $(this).closest('tr').remove();  
      
        // Remove the non-editable CSV line view  
        const csvLine = $('.csv-line[data-row-index="' + rowIndex + '"]');  
        csvLine.remove();  
    });  
      