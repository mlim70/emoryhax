const dyslexiaOptionButtons = document.getElementsByClassName("dyslexia-option");
let selectedDyslexiaButton = "dyslexia-none";

for (let dyslexiaOptionButton of dyslexiaOptionButtons) {
    console.log(dyslexiaOptionButton);
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Popup DOM loaded, setting up event listeners');

    // Color blindness options mapping
    const colorBlindButtons = {
        'color-blind-none': 'none',
        'color-blind-r': 'protanopia',    // Protanopia (red-blind)
        'color-blind-g': 'deuteranopia',  // Deuteranopia (green-blind)
        'color-blind-b': 'tritanopia',    // Tritanopia (blue-blind)
        'color-blind-c': 'complete'       // Full color blindness
    };

    // Set up event listeners for all colorblind buttons
    Object.keys(colorBlindButtons).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            console.log(`Setting up listener for button: ${buttonId}`);
            button.addEventListener('click', function() {
                const filterType = colorBlindButtons[buttonId];
                console.log(`Button clicked: ${buttonId}, applying filter: ${filterType}`);
                
                // Query for the active tab
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    if (!tabs[0]) {
                        console.error('No active tab found');
                        return;
                    }
                    
                    // Send message to content script
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {
                            action: 'applyColorBlindFilter',
                            filterType: filterType
                        },
                        function(response) {
                            if (chrome.runtime.lastError) {
                                console.error('Error:', chrome.runtime.lastError);
                            } else if (response && response.success) {
                                console.log('Filter applied successfully');
                            } else {
                                console.error('Failed to apply filter:', response?.error);
                            }
                        }
                    );
                });
            });
        } else {
            console.error(`Button not found: ${buttonId}`);
        }
    });

    // Translation functionality
    const targetLanguageSelect = document.getElementById('target-languages');
    if (targetLanguageSelect) {
        console.log('Setting up translation listener');
        targetLanguageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            console.log(`Language selected: ${selectedLanguage}`);
            
            // Query for the active tab
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (!tabs[0]) {
                    console.error('No active tab found');
                    return;
                }
                
                // Send message to content script
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: 'translatePage',
                        targetLanguage: selectedLanguage
                    },
                    function(response) {
                        if (chrome.runtime.lastError) {
                            console.error('Translation error:', chrome.runtime.lastError);
                        } else if (response && response.success) {
                            console.log('Translation applied successfully');
                        } else {
                            console.error('Failed to apply translation:', response?.error);
                        }
                    }
                );
            });
        });
    } else {
        console.error('Translation language selector not found');
    }
});