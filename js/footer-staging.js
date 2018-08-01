(function($) {

  $(document).ready(function() {
    // TODO: Refactor all jQuery objects to be here looked up once (perf. issue)
    var checkBoxContainer = $('#quiz-rx-checkbox-container');

   

    if (location.pathname === '/') {
      loadFitProblems(homeFitAssessmentTabSelector);
    } else if (location.pathname === '/quiz-results') {
      loadQuizResults();
    } else if (location.pathname === '/quiz') {

      // We are coming from Home / Fit assessment, so auto-scroll to second section
      if (window.location.search.indexOf('source=home') > 0) {
        // Let's check for selected fit problems.
        var preSelectedFitProblems = localStorage.getItem(SELECTED_FIT_PROBLEMS);
        // Only scroll down to second section if there was any selected previously or on Home.
        if (preSelectedFitProblems) {
          var parsedPreSelectedFitProblems = JSON.parse(preSelectedFitProblems);
          if (parsedPreSelectedFitProblems.length > 0) {
            // Scroll to target
            $('html, body').animate({
              scrollTop: $('#look-for').offset().top },
              {
                duration: 1000,
                specialEasing: {
                  width: "linear",
                  height: "easeInOutCirc"
                }
              }
            );
          }
        }
      }
      
      $('#btn-see-results').on('click', saveQuizResults);

      // Matters going forward
      loadFitProblems(quizFitAssessmentTabSelector);
      // Matters going back
      loadPreferences();
      loadRx();
      loadEyeExam();
      loadEmailName();

      $('#quiz-rx-tabs a').on('click', function() {
        // Check whether selected RX is "none (plano)" and disable / enable the radio button based on that
        if ($(this).data('rx') === 'plano') {
          checkBoxContainer.addClass('disabled');
          // Remove selection if it was selected
          $('#quiz-rx-checkbox-button').css('opacity', 0);
        } else {
          checkBoxContainer.removeClass('disabled');
        }
      });

      // TODO: Refactor once selection is unified across components

      // Update the Continue button's state below the Quiz / Fit Problems tabs.
      if (numberOfSelectedTabItems(quizFitAssessmentTabSelector) > 0) {
        $('#btn-quiz-fit-problems').removeClass('disabled');
      } else {
        $('#btn-quiz-fit-problems').addClass('disabled');
      }
    }

    // Setup on-click listeners
    setupTabMultiSelection(homeFitAssessmentTabSelector);
    setupTabMultiSelection(quizFitAssessmentTabSelector);
    setupTabSingleSelection(quizResultsFitProblemsTabSelector);
    setupTabSingleSelection(quizResultsPreferencesTabSelector);

    setupTabButtonStates(quizFitAssessmentTabSelector, '#btn-quiz-fit-problems');
    // Update the Continue button's state below the Quiz / Shopping Preferences tabs on every tab click.
    setupButtonStates(quizPreferencesTabSelector, '#btn-quiz-preferences');
    // Update the Continue button's state below the Quiz / Prescription tabs on every tab click.
    setupButtonStates(quizRxTabsSelector, '#btn-quiz-rx');
    // Update the Continue button's state below the Quiz / Eye exam tabs on every tab click.
    setupButtonStates(quizEyeExamSelector, '#btn-quiz-eye-exam');
  });

   // "Constants"
   var SELECTED_BG_COLOR = 'rgb(34, 34, 34)';
   var QUIZ_RESULTS = 'quizResults';
   var SELECTED_FIT_PROBLEMS = 'selectedFitProblems';
   var SELECTED_PREFS = 'selectedPrefs';
   var SELECTED_RX = 'selectedRx';
   var SELECTED_EYE_EXAM = 'selectedEyeExam';
   var LAST_SELECTED_PROBLEM = 'lastSelectedProblem';

   // TODO: turn these selectors to jQuery object where possible (perf.)
   var homeFitAssessmentTabSelector = '#fit-assessment-tabs';
   var quizFitAssessmentTabSelector = '#quiz-fit-assessment-tabs';
   var quizPreferencesTabSelector = '#quiz-preferences-tabs';
   var quizResultsFitProblemsTabSelector = '#quiz-results-fit-assessment-tabs';
   var quizResultsPreferencesTabSelector = '#quiz-results-preferences-tabs';
   var quizContainerSelector = '#quiz';
   var preferencesContainerSelector = '#look-for';
   var eyeExamContainerSelector = '#last-exam';
   var rxContainerSelector = '#prescription';
   var emailContainerSelector = '#customer-infos';
   var quizRxTabsSelector = '#quiz-rx-tabs';
   var quizEyeExamSelector = '#quiz-eye-exam';

  /**
   * Function that returns the number of selected item for a given tab (multi-select component).
   * Encounters the hidden Default tab in this specific case.
   */
  function numberOfSelectedTabItems(tabs) {
    var selector = tabs + ' .active';
    // Gotta check if the Default is the current - it also means it's active
    var isDefaultSelected = $(tabs + ' a[data-w-tab="Default"].active').length > 0;
    // Should not count with that being active. It's a hidden element.
    return $(selector).length - isDefaultSelected ? 1 : 0;
  }

  /**
   * Function for making sure the button below gets the proper disabled/enabled
   *  state updated on every click on the links
   */
  function setupButtonStates(links, button) {
    $(links + ' a').on('click', function() {
      // Need to make it slower than the fading animation. It only gets to "selected" color once animation is done.
      setTimeout(function () {
        if (getSelectedNodes(links, SELECTED_BG_COLOR).length > 0) {
          $(button).removeClass('disabled');
          // Remove the error state
          updateErrorState(false, links);
        } else {
          $(button).addClass('disabled');
        }
      }, 350);
    });
  }

  /**
   * Function for making sure the button below gets the proper disabled/enabled
   *  state updated on every click on the tabs
   */
  function setupTabButtonStates(tabs, button) {
    $(tabs + ' a').on('click', function() {
      if (numberOfSelectedTabItems(tabs) > 0) {
        $(button).removeClass('disabled');
        // Remove the error state
        updateErrorState(false, tabs);
      } else {
        $(button).addClass('disabled');
      }
    });
  }

  function updateErrorState(show, component) {
    switch (component) {
      case quizFitAssessmentTabSelector:
        showErrorState(show, quizContainerSelector);
        break;
      case quizPreferencesTabSelector:
        showErrorState(show, preferencesContainerSelector);
        break;
      case quizRxTabsSelector:
        showErrorState(show, rxContainerSelector);
        break;
      case quizEyeExamSelector:
        showErrorState(show, eyeExamContainerSelector);
        break;
      default:
        break;
    }
  }

  /**
   * Function for picking the Default (hidden) tab of the multi-select component,
   * and setting it as "current".
   *
   * This makes the tabs menu show the default image with default description.
   *
   * This is the same state as when none of the items are selected.
   */
  function selectDefaultTab(tabs) {
    // Find the Default tab
    var defaultTabSelector = tabs + ' a[data-w-tab="Default"]';
    var defaultTab = $(defaultTabSelector);

    // Workaround to make sure the click goes through
    setTimeout(function() {
      // Set the "current" to the Default tab
      defaultTab.click();
    }, 0);
  }

  /**
   * Function for setting up (single) selection state on a given tab item of the passed tabs when clicked.
   * This also makes sure the "current" content selection is being updated on deselection.
   */
  function setupTabSingleSelection(tabs) {
    $(tabs + ' a').on('click', function() {
      // Deselect others
      $(tabs).find('a').each( function() {
        $(this).removeClass('active');
      });

      // Select
      $(this).addClass('active');
    });
  }

  /**
   * Function for setting up (multi) selection state on a given tab item of the passed tabs when clicked.
   * This also makes sure the "current" content selection is being updated on deselection.
   */
  function setupTabMultiSelection(tabs) {
    $(tabs + ' a').on('click', function() {
      if ($(this).hasClass('active')) {
        // Deselect
        $(this).removeClass('active');
        // Make sure the Default tab is made the "current" content
        selectDefaultTab(tabs);
      } else {
        // Select
        $(this).addClass('active');
      }
    });
  }

  /**
   * Returns the number of items with the given background color in the container passed in.
   */
  function getSelectedNodes(container, selectedBackgroundColor) {
    return $(container).children().filter(function() {
      // Check whether background color is the selected color
      return $(this).css('background-color') == selectedBackgroundColor;
    });
  }

  /**
   * Function for showing / hiding the error indication on a given section.
   * Takes care of showing / hiding of heading and the error label.
   */
  function showErrorState(show, sectionSelector) {
    if (show) {
      $(sectionSelector + ' h2 span').show();
      $(sectionSelector + ' .error-label').show();
    } else {
      $(sectionSelector + ' h2 span').hide();
      $(sectionSelector + ' .error-label').hide();
    }
  }

  /**
   * Function for saving the previously fit problems to window.localStorage in the process of filling out the quiz.
   * This helps keeping the UI up-to-date with the state of the quiz.
   */
  function saveFitProblems() {
    var selectedNodes = getSelectedNodes(homeFitAssessmentTabSelector, SELECTED_BG_COLOR);

    // Saving the last selected node (the content reflects this)
    var lastSelectedNode = $(homeFitAssessmentTabSelector).find('a.w--current').data('problems');

    // Map the divs to their data attributes
    var selectedNodeDataIDs = $.map($(selectedNodes), function (d) {
      return $(d).data('problems');
    });

    var filteredSelectedNodes = selectedNodeDataIDs.filter( function(t) {
      return t !== 'default';
    });

    // Save the ids
    localStorage.setItem(SELECTED_FIT_PROBLEMS, JSON.stringify(filteredSelectedNodes));
    // Save the last selected item
    localStorage.setItem(LAST_SELECTED_PROBLEM, lastSelectedNode);
  }

  /**
   * Function to persist results of Quiz to window.localStorage.
   */
  function saveQuizResults() {
    var quizResults = {};

    // FIT PROBLEMS
    var selectedFitNodes = getSelectedNodes(quizFitAssessmentTabSelector, SELECTED_BG_COLOR);

    // Save the selected data ids
    var selectedNodeDataIDs = $.map($(selectedFitNodes), function (d) {
      return $(d).data('problems');
    });

    var filteredSelectedNodes = selectedNodeDataIDs.filter( function(t) {
      return t !== 'default';
    });

    // Update the ids
    localStorage.setItem(SELECTED_FIT_PROBLEMS, JSON.stringify(filteredSelectedNodes));

    // Map the divs to their titles
    var filteredSelectedNodeTitles = filteredSelectedNodes.map( function(t) {
      return $('[data-problems=' + t + ']').text();
    });

    quizResults.selectedFitProblems = filteredSelectedNodeTitles;

    // Show error in case it wasn't filled out
    var hasFitAnswer = filteredSelectedNodeTitles.length > 0
    showErrorState(!hasFitAnswer, quizContainerSelector);

    // PREFERENCES
    var selectedPrefNodes = getSelectedNodes(quizPreferencesTabSelector, SELECTED_BG_COLOR);

    // Map the divs to their data attributes
    var selectedPrefNodeDataIDs = $.map($(selectedPrefNodes), function (d) {
      return $(d).data('perf');
    });

    // Save the ids
    localStorage.setItem(SELECTED_PREFS, JSON.stringify(selectedPrefNodeDataIDs));

    // Map the links to their titles
    selectedNodeTitles = $.map($(selectedPrefNodes), function (d) {
      return $(d).text();
    });

    quizResults.selectedPreferences = selectedNodeTitles;

    // Show error in case it wasn't filled out
    var hasPrefAnswer = selectedPrefNodes.length > 0;
    showErrorState(!hasPrefAnswer, preferencesContainerSelector);

    // PRESCRIPTION
    var selectedRxNodes = getSelectedNodes('#quiz-rx-tabs', SELECTED_BG_COLOR);

    // Map the links to their titles
    selectedNodeTitles = $.map($(selectedRxNodes), function (d) {
      return $(d).text();
    });

    // Check if extra strong Rx is selected
    var extraStrongRxSelected = $('#quiz-rx-checkbox-button').css('opacity') === '1';

    quizResults.rx = selectedNodeTitles[0];
    quizResults.strongRx = extraStrongRxSelected;

    // Map the links to their ids
    selectedNodeIDs = $.map($(selectedRxNodes), function (d) {
      return $(d).data('rx');
    });

    // Save data ids
    localStorage.setItem(SELECTED_RX, JSON.stringify({ "rx": selectedNodeIDs[0], "strong" : extraStrongRxSelected }));

    // Show error in case it wasn't filled out
    var hasRxAnswer = selectedRxNodes.length > 0;
    showErrorState(!hasRxAnswer, rxContainerSelector);

    // EYE EXAM
    var selectedEyeExamNodes = getSelectedNodes('#quiz-eye-exam', SELECTED_BG_COLOR);

    // Map the links to their titles
    selectedNodeTitles = $.map($(selectedEyeExamNodes), function (d) {
      return $(d).text();
    });

    quizResults.eyeExam = selectedNodeTitles[0];

    // Map the links to their ids
    selectedNodeIDs = $.map($(selectedEyeExamNodes), function (d) {
      return $(d).data('exam');
    });

    // Save data ids
    localStorage.setItem(SELECTED_EYE_EXAM, selectedNodeIDs[0]);

    // Show error in case it wasn't filled out
    var hasEyeExamAnswer = selectedEyeExamNodes.length > 0;
    showErrorState(!hasEyeExamAnswer, eyeExamContainerSelector);

    // NAME & EMAIL
    var nameVal = $('#quiz-name-field').val();
    var emailVal = $('#quiz-email-field').val();

    quizResults.name = nameVal;
    quizResults.email = emailVal;

    var isEmailValid = $('#quiz-email-field').is(':valid');

    // Show error in case it wasn't filled out
    var hasNameAndEmailAnswer = (nameVal.length > 0) && (emailVal.length > 0);
    if (hasNameAndEmailAnswer && isEmailValid) {
      $(emailContainerSelector + ' h2 span').hide();
    } else {
      $(emailContainerSelector + ' h2 span').show();
    }

    // Check if every question was answered and show / hide the global warning for missing items
    var formComplete = hasFitAnswer && hasPrefAnswer && hasRxAnswer && hasEyeExamAnswer && hasNameAndEmailAnswer;
    if(formComplete && isEmailValid) {
      // Quiz was completed? For intercom tracking
      quizResults.webQuizCompleted = true;

      // Persist results
      localStorage.setItem(QUIZ_RESULTS, JSON.stringify(quizResults));

      $('#quiz-error-label').hide();
      // Navigate to Results page from code
      window.location.href = '/quiz-results';
    } else {
      // Error message based on whether it's only an email address validation issue
      var errorMessage = '*Please scroll up and answer all questions to continue.';
      if (formComplete && !isEmailValid) {
        errorMessage = '*Please enter a valid email address.'
      }

      // Update the message
      $('#quiz-error-label').text(errorMessage);

      // Unhide
      $('#quiz-error-label').show();
    }
  }
  /**
   * Function for loading the previously saved fit problems in the process of filling out the quiz.
   */
  function loadFitProblems(tabs) {
    var preSelectedFitProblems = localStorage.getItem(SELECTED_FIT_PROBLEMS);
    if (!preSelectedFitProblems) { return; }

    // Reading up the last selected item (the content reflects this)
    var lastSelectedProblem = localStorage.getItem(LAST_SELECTED_PROBLEM);
    var parsedPreSelectedFitProblems = JSON.parse(preSelectedFitProblems);

    // Let's see if there is a (potentially hidden) item set as "current" already
    var defaultCurrent = $(tabs).find('a.w--current');
    // Remove that
    defaultCurrent.removeClass('w--current');

    // Find the tabs with titles matching one of the previously saved "fit problem" items.
    var fitNodesToSelect = $(tabs).children().filter(function() {
      return parsedPreSelectedFitProblems.indexOf($(this).data('problems')) > -1;
    });

    fitNodesToSelect.each( function() {
      // Set selected background color
      $(this).addClass('active');

      // Set "current state" based on last selection on the previous page
      if ($(this).data('problems') === lastSelectedProblem) {
        $(this).addClass('w--current');
      }
    });

    // Enable the button, there are items selected
    if (fitNodesToSelect.length > 0) {
      $('#btn-fit-assessment').removeClass('disabled');
    }
  }


  /**
   * Function for loading the previously saved preferences on the quiz page.
   */
  function loadPreferences() {
    // Load preferences
    var prefJSON = localStorage.getItem(SELECTED_PREFS);
    if (!prefJSON) { return; }

    var parsedPrefResults = JSON.parse(prefJSON);
    
    // Find the tabs with titles matching one of the previously saved "preferences" items.
    var prefNodesToSelect = $(quizPreferencesTabSelector).children().filter(function() {
      return parsedPrefResults.indexOf($(this).data('perf')) > -1;
    });

    prefNodesToSelect.each( function() {
      // Set selected background color
      $(this).addClass('active');
    });

    // Enable the button, there are items selected
    if (prefNodesToSelect.length > 0) {
      $('#btn-quiz-preferences').removeClass('disabled');
    }
  }

   /**
   * Function for loading the previously saved Rx on the quiz page.
   */
  function loadRx() {
    // Load Rx
    var rxJSON = localStorage.getItem(SELECTED_RX);
    if (!rxJSON) { return; }

    var parsedResults = JSON.parse(rxJSON);
    var parsedRxResults = parsedResults.rx;

    // Find the tabs with titles matching one of the previously saved "Rx" items.
    var rxNodesToSelect = $(quizRxTabsSelector).children().filter(function() {
      return parsedRxResults.indexOf($(this).data('rx')) > -1;
    });

    rxNodesToSelect.each( function() {
      // Set selected background color
      $(this).css('background-color', SELECTED_BG_COLOR);
      $(this).css('color', 'white');
    });

    // Enable the button, there are items selected
    if (rxNodesToSelect.length > 0) {
      $('#btn-quiz-rx').removeClass('disabled');
    }

    var checkBoxContainer = $('#quiz-rx-checkbox-container');
    // Check whether selected RX is "none (plano)" and disable / enable the radio button based on that
    if ($(rxNodesToSelect[0]).data('rx') === 'plano') {
      checkBoxContainer.addClass('disabled');
    } else {
      checkBoxContainer.removeClass('disabled');
    }

    // Load strong Rx option value
    if (parsedResults.strong) {
      $('#quiz-rx-checkbox-button').css('opacity', 1);
    }
  }

  /**
   * Function for loading the previously saved Eye exam data on the quiz page.
   */
  function loadEyeExam() {
    // Load Eye exam data id from loacl storage
    var eyeExam = localStorage.getItem(SELECTED_EYE_EXAM);

    // Find the tabs with titles matching one of the previously saved "Eye exam" items.
    var examNodesToSelect = $(quizEyeExamSelector).children().filter(function() {
      return eyeExam === $(this).data('exam');
    });

    examNodesToSelect.each( function() {
      // Set selected background color
      $(this).css('background-color', SELECTED_BG_COLOR);
      $(this).css('color', 'white');
    });

     // Enable the button, there are items selected
     if (examNodesToSelect.length > 0) {
      $('#btn-quiz-eye-exam').removeClass('disabled');
    }
  }

  /**
   * Function for loading the previously saved email and name on the quiz page.
   */
  function loadEmailName() {
    var quizResults = localStorage.getItem(QUIZ_RESULTS);
     if (!quizResults) { return; }

     var parsedQuizResults = JSON.parse(quizResults);

     var name = parsedQuizResults.name;
     var email = parsedQuizResults.email;

     if (name !== null || name !== "") {
      $('#quiz-name-field').val(name);
     }

     if (email !== null || email !== "") {
      $('#quiz-email-field').val(email);
     }
  }

  /**
   * Function for pre-loading items from an array of nodes to the given tabs component.
   */
  function preLoadTabs(dataID, selectedNodes, tabSelector) {
      var selectedFirst = false;

      var allIDs = $(tabSelector).children().map(function() {
        return $(this).data(dataID);
      }).toArray();

      var selectedIDs = selectedNodes.map(function() {
        return $(this).data(dataID);
      }).toArray();

      allIDs.forEach(function (item) {
      var obj = $(tabSelector).find('[data-' + dataID + '=' + item + ']');

      if(selectedIDs.indexOf(item) > -1) {
        // Reveal these items
          $(obj).removeClass('hidden');

          // Select the first hit
          if (!selectedFirst) {
            $(obj).addClass('w--current');
            $(obj).addClass('active');
            selectedFirst = true;
          }
        } else {
          // Hide these items
          $(obj).addClass('hidden');

          // Unselect
          $(obj).removeClass('w--current');
      }
      });
  }

  /**
   * Function for pre-loading the final Quiz results with fit problems.
   */
  function loadQuizResults() {
    var quizJSON = localStorage.getItem(QUIZ_RESULTS);
    if (!quizJSON) { return; }

    var parsedResults = JSON.parse(quizJSON);

    // Update title to use stored name
    $('#quiz-results-title').text('Hi ' + parsedResults.name + ',');

    // Load fit problems
    var fitJSON = localStorage.getItem(SELECTED_FIT_PROBLEMS);
    if (!fitJSON) { return; }

    var parsedFitResults = JSON.parse(fitJSON);

    // Find the tabs with titles matching one of the previously saved "fit problem" items.
    var fitNodesToSelect = $(quizResultsFitProblemsTabSelector).children().filter(function() {
      return parsedFitResults.indexOf($(this).data('problems')) > -1;
    });

    preLoadTabs('problems', fitNodesToSelect, quizResultsFitProblemsTabSelector);

    // Load preferences
    var prefJSON = localStorage.getItem(SELECTED_PREFS);
    if (!prefJSON) { return; }

    var parsedPrefResults = JSON.parse(prefJSON);

    // Find the tabs with titles matching one of the previously saved "preferences" items.
    var prefNodesToSelect = $(quizResultsPreferencesTabSelector).children().filter(function() {
      return parsedPrefResults.indexOf($(this).data('perf')) > -1;
    });

    preLoadTabs('perf', prefNodesToSelect, quizResultsPreferencesTabSelector);

    // Load Rx
    $('#quiz-results-rx-tab').text(parsedResults.rx);

    // Show proper Rx description
    var singleVisionText = 'The majority of people who wear glasses require single-vision prescriptions, which correct for one field of vision (near or distance).\n We can fill any lens type, out of any material, in any prescription. Otica Total lenses are individually made to match your 3D data and frame style. All lenses come standard with premium coatings and the option to add sun tints, transitions, blue-light blocking, or polarization.';
    var bifocalText = 'Traditional bifocal lenses have a visible line that separates the lens into two powers, distance and reading.\n We can fill any lens type, out of any material, in any prescription. Otica Total lenses are individually made to match your 3D data and frame style. All lenses come standard with premium coatings and the option to add sun tints, transitions, blue-light blocking, or polarization.';
    var progressiveText = 'Progressive or multifocal lenses have no visible line and correct for both distance vision, reading vision, and everything in between.\n For our state-of-the-are progressives, we automatically account for vertex distance and frame height to make sure the wearer can easily transition between distance and reading vision. Otica Total lenses are individually made to match your 3D data and frame style. All lenses come standard with premium coatings and the option to add sun tints, transitions, blue-light blocking, or polarization.';
    var planoText = 'Want sunglasses or blue-light blocking computer glasses with no prescription? We custom-make those too.\n Otica Total lenses are individually made to match your 3D data and frame style. All lenses come standard with premium coatings and the option to add unique sun tints, transitions, blue-light blocking, or polarization.';

    if (parsedResults.rx === 'Single Vision (standard)') {
      $('#quiz-results-rx-content').text(singleVisionText);
    } else if (parsedResults.rx === 'Bifocal (with line)') {
      $('#quiz-results-rx-content').text(bifocalText);
    } else if (parsedResults.rx === 'Progressive (no line)') {
      $('#quiz-results-rx-content').text(progressiveText);
    } else if (parsedResults.rx === 'None (plano lenses)') {
      $('#quiz-results-rx-content').text(planoText);
    }

    // Eye exam strings
    var eyeExamHeader13Title = 'Your prescription is up to date';
    var eyeExam13Footnote = 'For those purchasing prescription eyewear, the California Board of Optometry requires we use a valid prescription written less than 2 years ago. We accept a photo of your prescription or an email forwarded from your optician.';
    var eyeExamHeader312Title = 'Your prescription is less than 2 years old, so you’re good to go!';
    var eyeExam312Footnote = 'For those purchasing prescription eyewear, the California Board of Optometry requires we use a valid prescription written less than 2 years ago. We accept a photo of your prescription or an email forwarded from your optician.';
    var eyeExamHeaderOlderThan2Title = 'If your prescription is older than 2 years, you’re due for a checkup.';
    var eyeExamHeaderOlderThan2Desc = 'Don’t worry though, you can place an order anytime and provide an updated prescription when you have it.';
    var eyeExamOlderThan2Footnote = 'It’s important to get your eye health examined periodically even if you aren’t experiencing any vision problems. For those purchasing prescription eyewear, the California Board of Optometry requires we use a valid prescription written less than 2 years ago. We accept a photo of your prescription or an email forwarded from your optician.';
    var eyeExamHeaderIdkTitle = 'Contact your eye doctor to see if you’re due for a checkup.';
    var eyeExamHeaderIdkDesc = 'Don’t worry though, you can place an order anytime and provide an updated prescription when you have it.';
    var eyeExamIdkFootnote = 'It’s important to get your eye health examined periodically even if you aren’t experiencing any vision problems. For those purchasing prescription eyewear, the California Board of Optometry requires we use a valid prescription written less than 2 years ago. We accept a photo of your prescription or an email forwarded from your optician.'

    // Load eye exam data
    if (parsedResults.eyeExam === 'Over a year ago') {
      // Show warning about out of date Rx
      $('#quiz-results-rx-warning-header').removeClass('hidden');
      $('#quiz-results-rx-header-warning-title').text(eyeExamHeaderOlderThan2Title);
      $('#quiz-results-rx-header-desc').text(eyeExamHeaderOlderThan2Desc);
      $('#quiz-results-rx-footnote').text(eyeExamOlderThan2Footnote);
    } else if(parsedResults.eyeExam === "I'm not sure") {
      // Show warning about out of date Rx
      $('#quiz-results-rx-warning-header').removeClass('hidden');
      $('#quiz-results-rx-header-warning-title').text(eyeExamHeaderIdkTitle);
      $('#quiz-results-rx-header-desc').text(eyeExamHeaderIdkDesc);
      $('#quiz-results-rx-footnote').text(eyeExamIdkFootnote);
    } else if(parsedResults.eyeExam === "1-3 months ago") {
      // Show your Rx is fine sign
      $('#quiz-results-rx-warning-header').addClass('hidden');
      $('#quiz-results-rx-header-desc').addClass('hidden');
      $('#quiz-results-rx-ok-header').removeClass('hidden');
      $('#quiz-results-rx-header-ok-title').text(eyeExamHeader13Title);
      $('#quiz-results-rx-footnote').text(eyeExam13Footnote);
    } else if(parsedResults.eyeExam === "3-12 months ago") {
      // Show your Rx is fine sign
      $('#quiz-results-rx-warning-header').addClass('hidden');
      $('#quiz-results-rx-header-desc').addClass('hidden');
      $('#quiz-results-rx-ok-header').removeClass('hidden');
      $('#quiz-results-rx-header-ok-title').text(eyeExamHeader312Title);
      $('#quiz-results-rx-footnote').text(eyeExam312Footnote);
    }
  }


  /**
   * Set cookies for ad tracking
   */
  function GetURLParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam){
        return sParameterName[1];
      }
    }
  }

  function setCookieIfValue(key, value) {
    if (value) {
      Cookies.set(key, value)
    }
  }

  // Set by adwords
  setCookieIfValue('campaign', GetURLParameter('campaign'));
  setCookieIfValue('channel', GetURLParameter('channel'));
  setCookieIfValue('adset', GetURLParameter('adset'));
  setCookieIfValue('ad', GetURLParameter('ad'));

  setCookieIfValue('keyword', GetURLParameter('keyword'));
  setCookieIfValue('gclid', GetURLParameter('gclid'));

  // Additional Params
  setCookieIfValue('gcl', GetURLParameter('gcl'));
  setCookieIfValue('gcid', GetURLParameter('gcid'));
  setCookieIfValue('originReferrer', GetURLParameter('source'));
})(jQuery);

