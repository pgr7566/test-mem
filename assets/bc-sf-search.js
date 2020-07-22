// Override Settings
var bcSfSearchSettings = {
    search: {
        //suggestionMode: 'test'
        //suggestionPosition: 'left'
    }
};

// Customize style of Suggestion box
BCSfFilter.prototype.customizeSuggestion = function(suggestionElement, searchElement, searchBoxId) {
};

BCSfFilter.prototype.beforeBuildSearchBox = function(id) {
    // Remove the default Instant Search of the theme
    jQ('.live-search-form, .site-header-search-form').removeAttr('data-live-search-form').removeAttr('data-live-search-flydown');
    jQ('input[name="q"]').removeAttr('data-live-search-input');
    jQ('.search-flydown').hide();
    jQ('button.site-header-search-button.button-primary').prop("type", "submit");
    jQ('button.live-search-button.button-primary').prop("type", "submit");
    jQ(document).ready(function() {
        jQ('.live-search-form, .site-header-search-form').off(".search-form");
        if (typeof bcHeaderSearch !== 'undefined') bcHeaderSearch.unload();
    });
};