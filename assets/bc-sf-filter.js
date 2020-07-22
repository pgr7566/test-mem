// Override Settings
var bcSfFilterSettings = {
    general: {
        limit: bcSfFilterConfig.custom.products_per_page,
        /* Optional */
        loadProductFirst: true,
        numberFilterTree: 2,
        showLimitList: '24,36,48'
    },
};

// Declare Templates
var bcSfFilterTemplate = {
    // Grid Template
    'productGridItemHtml': '<li class="productgrid--item {{customClass}}" ' + 
                                'data-product-item ' +
                                'data-product-quickshop-url="{{itemUrl}}" ' +
                                'data-quickshop-hash="{{itemDataSha256}}">' +
                                '<div class="productitem" data-product-item-content>' +
                                    '<a class="productitem--image-link" href="{{itemUrl}}" tabindex="-1" data-product-page-link>' +
                                        '<figure class="productitem--image" data-product-item-image>' +
                                            '{{itemImages}}' +
                                            '{{itemLabels}}' +
                                        '</figure>' +
                                    '</a>' +
                                    '<div class="productitem--info">' +
                                        '{{itemSwatch}}' +
                                        '{{emphasizePrice}}'+
                                        '<h2 class="productitem--title">' +
                                            '<a href="{{itemUrl}}" data-product-page-link>{{itemTitle}}</a>' +
                                        '</h2>' +
                                        '{{itemVendor}}' +
                                        '{{noEmphasizePrice}}'+
                                        '{{itemReviews}}' +
                                        '{{itemDescription}}' +
                                    '</div>' +
                                    '{{itemActions}}' +
                                '</div>' +
                                '{{itemQuickShopSettings}}' +
                            '</li>',

    // Pagination Template
    'previousActiveHtml': '<li class="pagination--previous"><a class="pagination--item" href="{{itemUrl}}"><span class="pagination--chevron-left" aria-hidden="true"><svg aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" > <g fill="currentColor" fill-rule="evenodd"> <polygon class="icon-chevron-down-left" points="4 5.371 7.668 1.606 6.665 .629 4 3.365"/> <polygon class="icon-chevron-down-right" points="4 3.365 1.335 .629 1.335 .629 .332 1.606 4 5.371"/> </g> </svg></span>' + bcSfFilterConfig.label.prev + '</a></li>',
    'previousDisabledHtml': '',
    'nextActiveHtml': '<li class="pagination--next"><a class="pagination--item" href="{{itemUrl}}">' + bcSfFilterConfig.label.next + '<span class="pagination--chevron-right" aria-hidden="true"><svg aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" > <g fill="currentColor" fill-rule="evenodd"> <polygon class="icon-chevron-down-left" points="4 5.371 7.668 1.606 6.665 .629 4 3.365"/> <polygon class="icon-chevron-down-right" points="4 3.365 1.335 .629 1.335 .629 .332 1.606 4 5.371"/> </g> </svg></span></a></li>',
    'nextDisabledHtml': '',
    'pageItemHtml': '<li><a class="pagination--item" href="{{itemUrl}}">{{itemTitle}}</a></li>',
    'pageItemSelectedHtml': '<li class="pagination--active"><span class="pagination--item">{{itemTitle}}</span></li>',
    'pageItemRemainHtml': '<li class="pagination--ellipsis"><span class="pagination--item">{{itemTitle}}</span></li>',
    'paginateHtml': '<div class="pagination--container"><ul class="pagination--inner">{{previous}}{{pageItems}}{{next}}</ul></div>',

    // Sorting Template
    'sortingHtml':  '<label class="utils-sortby-title" for="bc-sf-filter-top-sorting-select">' + bcSfFilterConfig.label.sorting + '</label>' +
                    '<div class="utils-sortby-select form-field-select-wrapper no-label">' +
                        '<select id="bc-sf-filter-top-sorting-select" class="form-field form-field-select">{{sortingItems}}</select>' +
                        '<svg aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" > <g fill="currentColor" fill-rule="evenodd"> <polygon class="icon-chevron-down-left" points="4 5.371 7.668 1.606 6.665 .629 4 3.365"/> <polygon class="icon-chevron-down-right" points="4 3.365 1.335 .629 1.335 .629 .332 1.606 4 5.371"/> </g> </svg>' +
                    '</div>',

    // Show limit Template
    'showLimitHtml': '<li><span class="utils-showby-title">' + bcSfFilterConfig.label.show_per_page + '</span></li>{{showLimitItems}}',
};

/************************** BUILD PRODUCT LIST **************************/

// Build Product Grid Item
BCSfFilter.prototype.buildProductGridItem = function(data, index, totalProduct) {
    /*** Prepare data ***/
    var images = data.images_info;
    var soldOut = !data.available; // Check a product is out of stock
    var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
    var priceVaries = data.price_min != data.price_max; // Check a product has many prices
    // Get First Variant (selected_or_first_available_variant)
    var firstVariant = data['variants'][0];
    if (getParam('variant') !== null && getParam('variant') != '') {
        var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant'); });
        if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
    } else {
        for (var i = 0; i < data['variants'].length; i++) {
            if (data['variants'][i].available) {
                firstVariant = data['variants'][i];
                break;
            }
        }
    }
    /*** End Prepare data ***/

    // Get Template
    var itemHtml = bcSfFilterTemplate.productGridItemHtml;

    // Add custom class
    var customClass = 'imagestyle--' + bcSfFilterConfig.custom.product_grid_image_style;
    if (onSale) customClass += ' productitem--sale';
    if (bcSfFilterConfig.custom.emphasize_price) customClass += ' productitem--emphasis';
    itemHtml = itemHtml.replace(/{{customClass}}/g, customClass);

    var itemImages = '';
  	if (images.length > 0) {
      	if (images.length > 1 && bcSfFilterConfig.custom.product_grid_show_second_image) {
          	itemImages += buildImage(images[1], '512x', 'productitem--image-alternate');
        }
      	itemImages += buildImage(images[0], '512x', 'productitem--image-primary');
    } else {
      	itemImages += buildImage(null, '512x', 'productitem--image-primary');
    }
  	itemHtml = itemHtml.replace(/{{itemImages}}/g, itemImages);

    // Add Thumbnail
    var itemThumbUrl = images.length > 0 ? this.optimizeImage(images[0]['src'], '512x') : bcSfFilterConfig.general.no_image_url;
    itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);

    // Add Label
    var itemLabelsHtml = '';
    if (soldOut) {
        itemLabelsHtml += '<span class="productitem--badge badge--soldout">' + bcSfFilterConfig.label.sold_out +'</span>';
    } else {
        if (onSale && bcSfFilterConfig.custom.product_sales_badge) {
            var savePrice = data.compare_at_price_min - data.price_min;
            var percentSavePrice = Math.round(savePrice * 100 / data.compare_at_price_max);
            var savePriceHtml = '<span class="money" data-price-money-saved>' + this.formatMoney(savePrice) + '</span>';
            var percentSavePriceHtml = '<span data-price-percent-saved>' + percentSavePrice + '</span>';
            itemLabelsHtml += '<span class="productitem--badge badge--sale" data-badge-sales>';
            switch (bcSfFilterConfig.custom.product_sales_badge_style) {
                case 'percentile': itemLabelsHtml += bcSfFilterConfig.label.sale_percentile_html.replace(/{{ saved }}/g, percentSavePriceHtml); break;
                case 'money': itemLabelsHtml += bcSfFilterConfig.label.sale_money_html.replace(/{{ saved }}/g, this.formatMoney(savePrice)); break;
                default: itemLabelsHtml += bcSfFilterConfig.label.sale; break;
            }
            itemLabelsHtml += '</span>';
        }
    }
    itemHtml = itemHtml.replace(/{{itemLabels}}/g, itemLabelsHtml);

    // Add Swatches
    var swatchHtml = buildSwatch(data);
    itemHtml = itemHtml.replace(/{{itemSwatch}}/g, swatchHtml);

    // Add Price
    var priceHtml = '';
    var classVaries = priceVaries ? 'price--varies' : '';
    var visibleClass = onSale || bcSfFilterConfig.custom.emphasize_price ? 'visible' : '';
    priceHtml += '<div class="productitem--price ' + classVaries + '">';
    priceHtml += '<div class="price--compare-at ' + visibleClass + '" data-price-compare-at>';
    var comparePrice = '<span class="money">' + this.formatMoney(data.compare_at_price_min) + '</span>';
    if (priceVaries && onSale){
        priceHtml += bcSfFilterConfig.label.range_html.replace(/{{ price }}/g, comparePrice);
    } else {
        if (onSale) {
            priceHtml += comparePrice;
        } else {
            if (bcSfFilterConfig.custom.emphasize_price) {
                priceHtml += '<span class="price--spacer"></span>';
            } else {
                priceHtml += '<span class="money"></span>';
            }
        }
    }
    priceHtml += '</div>';
    priceHtml += '<div class="price--main" data-price>';
    var price = '<span class="money">' + this.formatMoney(data.price_min) + '</span>';
    if (priceVaries) {
        priceHtml += bcSfFilterConfig.label.range_html.replace(/{{ price }}/g, price);
    } else {
        priceHtml += price;
    }
    priceHtml += '</div>';
    priceHtml += '</div>';

    // Add emphasize price
    var emphasizePriceHtml = '';
    var noEmphasizePriceHtml = '';
    if (bcSfFilterConfig.custom.emphasize_price) {
        emphasizePriceHtml += priceHtml;
    } else {
        noEmphasizePriceHtml += priceHtml;
    }
    itemHtml = itemHtml.replace(/{{emphasizePrice}}/g, emphasizePriceHtml);
    itemHtml = itemHtml.replace(/{{noEmphasizePrice}}/g, noEmphasizePriceHtml);

    // Add vendor
    var itemVendorHtml = '';
    if (bcSfFilterConfig.custom.show_vendor && data.vendor !== '') {
        itemVendorHtml += '<h3 class="productitem--vendor">' + data.vendor + '</h3>';
    }
    itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

    // Add review rating
    var itemReviewsHtml = '';
    if (bcSfFilterConfig.custom.product_ratings_reviews) {
        itemReviewsHtml +=  '<div class="productitem--ratings">' +
                                '<span class="shopify-product-reviews-badge" data-id="{{itemId}}">' +
                                    '<span class="spr-badge">' +
                                        '<span class="spr-starrating spr-badge-starrating">' +
                                            '<i class="spr-icon spr-icon-star-empty"></i>' +
                                            '<i class="spr-icon spr-icon-star-empty"></i>' +
                                            '<i class="spr-icon spr-icon-star-empty"></i>' +
                                            '<i class="spr-icon spr-icon-star-empty"></i>' +
                                            '<i class="spr-icon spr-icon-star-empty"></i>' +
                                        '</span>' +
                                    '</span>' +
                                '</span>' +
                            '</div>';
    }
    itemHtml = itemHtml.replace(/{{itemReviews}}/g, itemReviewsHtml);

    // Add description    
    var itemDescriptionHtml = jQ('<div></div>').html(jQ.parseHTML(data.body_html)).text(); // Strips html tags
    itemDescriptionHtml = '<div class="productitem--description">' + itemDescriptionHtml + '</div>';
    itemHtml = itemHtml.replace(/{{itemDescription}}/g, itemDescriptionHtml);

    // Add quickBtn
    var itemActionsHtml = buildActions(data, firstVariant);
    itemHtml = itemHtml.replace(/{{itemActions}}/g, itemActionsHtml);

    // Add main attribute (Always put at the end of this function)
    itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
    itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
    itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
    itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

  	var itemQuickShopSettings = '';
  	if (bcSfFilterConfig.custom.enable_quick_buy) {
      	itemQuickShopSettings += '<script type="application/json" data-quick-buy-settings>';
      	itemQuickShopSettings += '{';
        itemQuickShopSettings += '"cart_redirection": ' + bcSfFilterConfig.custom.cart_redirect + ','
        itemQuickShopSettings += '"money_format": "' + bcSfFilterConfig.custom.money_format + '"'
        itemQuickShopSettings += '}'
      	itemQuickShopSettings += '</script>';
    }
  	itemHtml = itemHtml.replace(/{{itemQuickShopSettings}}/g, itemQuickShopSettings);

  	var itemDataSha256 = sha256(JSON.stringify(data.id));
  	itemHtml = itemHtml.replace(/{{itemDataSha256}}/g, itemDataSha256);
  
    return itemHtml;
};

BCSfFilter.prototype.buildProductListItem = function(data, index, totalProduct){
    return this.buildProductGridItem(data, index, totalProduct);
}

function buildImage(imageInfo, size, className) {
    if (!imageInfo) {
        imageInfo = {
            src: bcSfFilterConfig.general.no_image_url,
            width: 480,
            height: 480,
            aspect_ratio: 1
        }
    }

    var width = size.split('x')[0];
    var height = width * imageInfo.aspect_ratio;
    var srcset = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='X' height='Y'></svg>";
    srcset = srcset.replace('X', width).replace('Y', height).replace(' ', '%20');
    
    var html = '<img ' +
                'src="'  + bcsffilter.optimizeImage(imageInfo.src, size) +'" ' +
                'class="'+ className +'" ' +
                'alt="{{itemTitle}}" ' +
                'data-rimg="lazy" ' +
                'data-rimg-scale="1" ' +
                'data-rimg-template="' + bcsffilter.optimizeImage(imageInfo.src, '{size}') + '" ' +
                'data-rimg-max="' + imageInfo.width + 'x' + imageInfo.height +'" ' +
                'data-rimg-crop ' +
                'srcset="'+ srcset +'">';

    html += '<div data-rimg-canvas></div>';
    return html;
}

function buildActions(data, firstVariant){
    var actionsHtml = '';
    var has_variants = firstVariant['option_title'] == 'Default Title' ? false : true;
    if (bcSfFilterConfig.custom.enable_quick_look == true || bcSfFilterConfig.custom.enable_quick_buy == true) {
        var quick_look_text = bcSfFilterConfig.label.quick_look_text;
        var quick_buy_text = bcSfFilterConfig.label.quick_buy_text;
        var quick_look_classes = 'productitem--action-trigger button-secondary';
        var quick_buy_classes = 'productitem--action-trigger productitem--action-atc button-primary';
        if (has_variants) {
            quick_buy_text = bcSfFilterConfig.label.quick_choose_options;
        }
        if (!data.available) {
            quick_buy_text = bcSfFilterConfig.label.sold_out;
            quick_buy_classes = quick_buy_classes + ' disabled';
        }
        actionsHtml += '<div class="productitem--actions" data-product-actions>';
        if (bcSfFilterConfig.custom.enable_quick_look) {
            actionsHtml += '<div class="productitem--action">' +
                                '<button class="'+ quick_look_classes +'" data-quickshop-full data-id="{{itemId}}" type="button" tabindex="1">' + quick_look_text +
                                '</button>' +
                            '</div>';
        }
        if (bcSfFilterConfig.custom.enable_quick_buy) {
            if (!has_variants) {
                var temp = ' data-quick-buy ';
            } else {
                var temp = ' data-quickshop-slim ';
            }
            actionsHtml += '<div class="productitem--action">' +
                                '<button class="' + quick_buy_classes + '" tabindex="1" type="button" aria-label="' + quick_buy_text + '"' +
                                temp + 'data-variant-id="' + data.variants[0].id + '"';
            if (!data.available) {
                actionsHtml += ' disabled';
            }
            actionsHtml += '>';
            actionsHtml += '<span class="atc-button--text">' + quick_buy_text + '</span>';
            actionsHtml += '<span class="atc-button--icon">';
            actionsHtml += '<svg aria-hidden="true" focusable="false" role="presentation" width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" > <g fill-rule="nonzero" fill="currentColor"> <path d="M13 26C5.82 26 0 20.18 0 13S5.82 0 13 0s13 5.82 13 13-5.82 13-13 13zm0-3.852a9.148 9.148 0 1 0 0-18.296 9.148 9.148 0 0 0 0 18.296z" opacity=".29"/><path d="M13 26c7.18 0 13-5.82 13-13a1.926 1.926 0 0 0-3.852 0A9.148 9.148 0 0 1 13 22.148 1.926 1.926 0 0 0 13 26z"/> </g> </svg>';
            actionsHtml += '</span>';
            actionsHtml += '</button>';
            actionsHtml += '</div>';
        }

        actionsHtml += '</div>';
    }
    return actionsHtml;
}

function buildSwatch(data){
    var html = '';
    var swatches = [];
    var swatchValues = [];
    var swatchOptionIndex = 1;
    if (bcSfFilterConfig.custom.swatches_enable && bcSfFilterConfig.custom.swatch_trigger){
        var customColors = bcSfFilterConfig.custom.swatches_custom_colors.split('\n');
        data.variants.forEach(function(variant){
            var swatchValue = '';
            variant.options = variant.merged_options; // Use for theme function
            variant.merged_options.forEach(function(merged_option, index){
                var key = merged_option.split(':')[0].trim();
                var value = merged_option.split(':')[1].trim();
                if (key.toLowerCase() == bcSfFilterConfig.custom.swatch_trigger && swatchValues.indexOf(value.toLowerCase()) == -1){               
                    swatchValue = value;
                    swatchValues.push(value.toLowerCase());
                    swatchOptionIndex = index + 1;
                }
            })
            if (swatchValue){
                var swatch ='<label>' +
                                '<input class="productitem--swatches-input" type="radio" name="swatch" value="{{swatchValue}}">' +
                                '<div class="productitem--swatches-swatch-wrapper" data-swatch-tooltip="{{swatchValue}}" data-swatch>' +
                                    '<div class="productitem--swatches-swatch">' +
                                        '<div class="productitem--swatches-swatch-inner" '+
                                        'style="background-color:{{backgroundColor}}; background-color:{{customColor}}; background-image:url({{backgroundImage}}); background-size:cover"></div>' +
                                    '</div>' +
                                '</div>' +
                            '</label>';
                var customColor = '';
                customColors.forEach(function(color){
                    if (color.split(':').length == 2){
                        var customColorName = color.split(':')[0].trim().toLowerCase();
                        var customColorValue = color.split(':')[1].trim().toLowerCase();
                        if (customColorName == swatchValue.toLowerCase()){
                            customColor = customColorValue;
                        }
                    }
                })
                
                var slugifyValue = bcsffilter.slugify(swatchValue);
                var backgroundColor = slugifyValue.split('-').pop();
                var backgroundImage = '';
                if (bcSfFilterConfig.custom.swatches_option_style == "variant_image" && variant.image){
                    backgroundImage = bcsffilter.optimizeImage(variant.image, '50x');
                } else {
                    backgroundImage = bcSfFilterMainConfig.general.file_url.split('?')[0] + slugifyValue + '.png';
                }

                swatch = swatch.replace(/{{swatchValue}}/g, swatchValue);
                swatch = swatch.replace(/{{backgroundColor}}/g, backgroundColor);
                swatch = swatch.replace(/{{backgroundImage}}/g, backgroundImage);
                swatch = swatch.replace(/{{customColor}}/g, customColor);
                swatches.push(swatch);
            }
        })
        
        if (swatchValues.length > 0){           
            var html =  '<div class="productitem--swatches {{swatchClass}}" data-swatches>' +
                            '<script type="application/json" data-swatch-data>' +
                              '{' +
                                '"hash": "{{itemDataSha256}}",' +
                                '"swatchOptionKey": "{{swatchOptionKey}}",' +
                                '"variants": {{variantsJson}}' +
                              '}' +
                            '</script>' +
                            '<form class="productitem--swatches-container" data-swatches-container>' +
                                swatches.join(' ') +
                            '</form>' +
                            '<button class="productitem--swatches-count-wrapper" data-swatch-count-wrapper>' +
                                '<div class="productitem--swatches-count" data-swatch-count>+</div>' +
                            '</button>' +
                        '</div>';
            
            var swatchClass = bcSfFilterConfig.custom.swatches_shape == 'square' 
                            && bcSfFilterConfig.custom.swatches_option_style ==  'variant_image' ?  
                            'swatches-variant-images-square' : '';

            html = html.replace(/{{swatchClass}}/g, swatchClass);
            html = html.replace(/{{swatchOptionKey}}/g, 'option' + swatchOptionIndex);
            html = html.replace(/{{variantsJson}}/g, JSON.stringify(data.variants));
        }
    }
    
    return html;
}

/************************** END BUILD PRODUCT LIST **************************/

// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
    // Get page info
    var currentPage = parseInt(this.queryParams.page);
    var totalPage = Math.ceil(totalProduct / this.queryParams.limit);

    // If it has only one page, clear Pagination
    if (totalPage == 1) {
        jQ(this.selector.pagination).html('');
        return false;
    }

    if (this.getSettingValue('general.paginationType') == 'default') {
        var paginationHtml = bcSfFilterTemplate.paginateHtml;

        // Build Previous
        var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousActiveHtml : bcSfFilterTemplate.previousDisabledHtml;
        previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage - 1));
        paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

        // Build Next
        var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextActiveHtml :  bcSfFilterTemplate.nextDisabledHtml;
        nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
        paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

        // Create page items array
        var beforeCurrentPageArr = [];
        for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
            beforeCurrentPageArr.unshift(iBefore);
        }
        if (currentPage - 4 > 0) {
            beforeCurrentPageArr.unshift('...');
        }
        if (currentPage - 4 >= 0) {
            beforeCurrentPageArr.unshift(1);
        }
        beforeCurrentPageArr.push(currentPage);

        var afterCurrentPageArr = [];
        for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
            afterCurrentPageArr.push(iAfter);
        }
        if (currentPage + 3 < totalPage) {
            afterCurrentPageArr.push('...');
        }
        if (currentPage + 3 <= totalPage) {
            afterCurrentPageArr.push(totalPage);
        }

        // Build page items
        var pageItemsHtml = '';
        var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
        for (var iPage = 0; iPage < pageArr.length; iPage++) {
            if (pageArr[iPage] == '...') {
                pageItemsHtml += bcSfFilterTemplate.pageItemRemainHtml;
            } else {
                pageItemsHtml += (pageArr[iPage] == currentPage) ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml;
            }
            pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
            pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, pageArr[iPage]));
        }
        paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);

        paginationHtml = jQ.parseHTML(paginationHtml);
        jQ(this.selector.pagination).html(paginationHtml);
    }
};

/************************** BUILD TOOLBAR **************************/

// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
    if (bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
        jQ(this.selector.topSorting).html('');

        var sortingArr = this.getSortingList();
        if (sortingArr) {
            // Build content
            var sortingItemsHtml = '';
            for (var k in sortingArr) {
                sortingItemsHtml += '<option value="' + k +'">' + sortingArr[k] + '</option>';
            }
            var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
            html = jQ.parseHTML(html);
            jQ(this.selector.topSorting).html(html);

            // Set current value
            jQ(this.selector.topSorting + ' select').val(this.queryParams.sort);
        }
    }
};

// Build Show Limit
BCSfFilter.prototype.buildFilterShowLimit = function() {
    if (bcSfFilterTemplate.hasOwnProperty('showLimitHtml')) {
        jQ(this.selector.topShowLimit).html('');

        var numberList = this.getSettingValue('general.showLimitList');
        if (numberList != '') {
            // Build content
            var showLimitItemsHtml = '';
            var arr = numberList.split(',');
            for (var k = 0; k < arr.length; k++) {
                if (arr[k] == this.queryParams.limit) {
                    showLimitItemsHtml += '<li><a class="utils-showby-item active" href="' + arr[k] +'">' + arr[k] + '</a></li>';
                } else {
                    showLimitItemsHtml += '<li><a class="utils-showby-item" href="' + arr[k] +'">' + arr[k] + '</a></li>';
                }
            }
            var html = bcSfFilterTemplate.showLimitHtml.replace(/{{showLimitItems}}/g, showLimitItemsHtml);
            html = jQ.parseHTML(html);
            jQ(this.selector.topShowLimit).html(html);
        }
    }
};

BCSfFilter.prototype.buildShowLimitEvent = function() {
    var _this = this;
    jQ(this.selector.topShowLimit + ' li a').click(function(e) {
        onInteractWithToolbar(e, 'limit', _this.queryParams.limit, jQ(this).attr('href'));
    })
};

// Build Breadcrumb
BCSfFilter.prototype.buildBreadcrumb = function(colData, apiData) {
    if (typeof colData !== 'undefined' && colData.hasOwnProperty('collection')) {
        var colInfo = colData.collection;
        var delimiter = '<span class="breadcrumbs-delimiter" aria-hidden="true"><svg aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" width="8" height="5" viewBox="0 0 8 5"><path fill="currentColor" fill-rule="evenodd" d="M1.002.27L.29.982l3.712 3.712L7.714.982 7.002.27l-3 3z"/></svg></span>';
        var breadcrumbHtml = '<a href="/">' + bcSfFilterConfig.label.breadcrumb_home + '</a> ';
        breadcrumbHtml += delimiter;
        breadcrumbHtml += ' <span>' + colInfo.title + '</span>';
        breadcrumbHtml = jQ.parseHTML(breadcrumbHtml);
        jQ('.breadcrumbs-container').html(breadcrumbHtml);
    }
};

// Build Display type
BCSfFilter.prototype.buildFilterDisplayType = function() {
    var itemHtml = '<span class="utils-viewtoggle-label">' + bcSfFilterConfig.label.view_as_title + ' </span>';
    itemHtml += '<button class="active bc-sf-filter-display-grid" data-display-type="' + this.buildToolbarLink('grid_list', 'list-view', 'grid-view') + '">';
    itemHtml += '<svg class="icon-grid " aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">      <path fill="currentColor" fill-rule="nonzero" d="M2 0h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 2v16h16V2H2zm3 3h4v4H5V5zm6 0h4v4h-4V5zm-6 6h4v4H5v-4zm6 0h4v4h-4v-4z"></path>    </svg>';
    itemHtml == '</button>';
    itemHtml += '<button class="bc-sf-filter-display-list" data-display-type= "' + this.buildToolbarLink('grid_list', 'grid-view', 'list-view') + '">';
    itemHtml += '<svg class="icon-list " aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">      <path fill="currentColor" fill-rule="nonzero" d="M2 0h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 2v16h16V2H2zm3 3h10v2H5V5zm0 4h10v2H5V9zm0 4h10v2H5v-2z"></path>    </svg>';
    itemHtml == '</button>';

    itemHtml = jQ.parseHTML(itemHtml);
    jQ(this.selector.topDisplayType).html(itemHtml);

    // Active current display type
    jQ(this.selector.topDisplayType).find('button').removeClass('active');
    if (this.queryParams.grid_list == 'list-view') {
        jQ(this.selector.topDisplayType).find('button.bc-sf-filter-display-list').addClass('active');
    } else {
        jQ(this.selector.topDisplayType).find('button.bc-sf-filter-display-grid').addClass('active');
    }
};

// Build Display type event
BCSfFilter.prototype.buildDisplayTypeEvent = function() {
    var _this = this;
    jQ(this.selector.topDisplayType + ' button').unbind('click');
    jQ(this.selector.topDisplayType + ' button').click(function(e) {
         e.preventDefault();
        _this.internalClick = true;
        jQ(this).parent().children('button').removeClass('active');
        jQ(this).addClass('active');
        var newUrl = jQ(this).attr('data-display-type');
        if (newUrl.indexOf('list-view') != -1) {
            jQ('.productgrid--outer').removeClass('productgrid-gridview');
            jQ('.productgrid--outer').addClass('productgrid-listview');            
        } else {
            jQ('.productgrid--outer').removeClass('productgrid-listview');
            jQ('.productgrid--outer').addClass('productgrid-gridview');
        }
        _this.onChangeData(newUrl, 'grid_list');
    })
};

/************************** END BUILD TOOLBAR **************************/

// Add additional feature for product list, used commonly in customizing product list
BCSfFilter.prototype.buildExtrasProductList = function(data, eventType) {};

// Build additional elements
BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {
    // In empire.js.liquid:
    // - Add "var bcInitEmpire;" to the begining
    // - Go to the end, add "bcInitEmpire = Empire_initEmpire;" before the 2 brackets close:

    //      (some codes here...)    
    //      bcInitEmpire = Empire_initEmpire;
    //      /***/ })
    //      /******/ });
    //      (end of file)
    
    if (window.bcInitEmpire && typeof bcInitEmpire == 'function') {
        // Don't reinit the recently viewed block
        if (jQ('[data-section-type="static-recently-viewed"]').length > 0) {
            jQ('[data-section-type="static-recently-viewed"]').attr('data-section-type', 'bc-static-recently-viewed');
        }
        // Don't reinit the header
        if (jQ('[data-section-type="static-header"]').length > 0) {
            jQ('[data-section-type="static-header"]').attr('data-section-type', 'bc-static-header');
        }
        // Reinit theme
        bcInitEmpire();
        if (jQ('[data-section-type="bc-static-recently-viewed"]').length > 0) {
            jQ('[data-section-type="bc-static-recently-viewed"]').attr('data-section-type', 'static-recently-viewed');
        }
        if (jQ('[data-section-type="bc-static-header"]').length > 0) {
            jQ('[data-section-type="bc-static-header"]').attr('data-section-type', 'static-header');
        }
    }
};

// sha256 of a string and display its hex digest
function sha256(ascii) {
	function rightRotate(value, amount) {
		return (value>>>amount) | (value<<(32 - amount));
	};
	
	var mathPow = Math.pow;
	var maxWord = mathPow(2, 32);
	var lengthProperty = 'length'
	var i, j; // Used as a counter across the whole file
	var result = ''

	var words = [];
	var asciiBitLength = ascii[lengthProperty]*8;
	
	//* caching results is optional - remove/add slash from front of this line to toggle
	// Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
	// (we actually calculate the first 64, but extra values are just ignored)
	var hash = sha256.h = sha256.h || [];
	// Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
	var k = sha256.k = sha256.k || [];
	var primeCounter = k[lengthProperty];
	/*/
	var hash = [], k = [];
	var primeCounter = 0;
	//*/

	var isComposite = {};
	for (var candidate = 2; primeCounter < 64; candidate++) {
		if (!isComposite[candidate]) {
			for (i = 0; i < 313; i += candidate) {
				isComposite[i] = candidate;
			}
			hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
			k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
		}
	}
	
	ascii += '\x80' // Append Ƈ' bit (plus zero padding)
	while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
	for (i = 0; i < ascii[lengthProperty]; i++) {
		j = ascii.charCodeAt(i);
		if (j>>8) return; // ASCII check: only accept characters in range 0-255
		words[i>>2] |= j << ((3 - i)%4)*8;
	}
	words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
	words[words[lengthProperty]] = (asciiBitLength)
	
	// process each chunk
	for (j = 0; j < words[lengthProperty];) {
		var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
		var oldHash = hash;
		// This is now the undefinedworking hash", often labelled as variables a...g
		// (we have to truncate as well, otherwise extra entries at the end accumulate
		hash = hash.slice(0, 8);
		
		for (i = 0; i < 64; i++) {
			var i2 = i + j;
			// Expand the message into 64 words
			// Used below if 
			var w15 = w[i - 15], w2 = w[i - 2];

			// Iterate
			var a = hash[0], e = hash[4];
			var temp1 = hash[7]
				+ (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
				+ ((e&hash[5])^((~e)&hash[6])) // ch
				+ k[i]
				// Expand the message schedule if needed
				+ (w[i] = (i < 16) ? w[i] : (
						w[i - 16]
						+ (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
						+ w[i - 7]
						+ (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
					)|0
				);
			// This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
			var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
				+ ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
			
			hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
			hash[4] = (hash[4] + temp1)|0;
		}
		
		for (i = 0; i < 8; i++) {
			hash[i] = (hash[i] + oldHash[i])|0;
		}
	}
	
	for (i = 0; i < 8; i++) {
		for (j = 3; j + 1; j--) {
			var b = (hash[i]>>(j*8))&255;
			result += ((b < 16) ? 0 : '') + b.toString(16);
		}
	}
	return result;
};

// Build Default layout
BCSfFilter.prototype.buildDefaultElements=function(){var isiOS=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,isSafari=/Safari/.test(navigator.userAgent),isBackButton=window.performance&&window.performance.navigation&&2==window.performance.navigation.type;if(!(isiOS&&isSafari&&isBackButton)){var self=this,url=window.location.href.split("?")[0],searchQuery=self.isSearchPage()&&self.queryParams.hasOwnProperty("q")?"&q="+self.queryParams.q:"";window.location.replace(url+"?view=bc-original"+searchQuery)}};

function customizeJsonProductData(data) {for (var i = 0; i < data.variants.length; i++) {var variant = data.variants[i];var featureImage = data.images.filter(function(e) {return e.src == variant.image;});if (featureImage.length > 0) {variant.featured_image = {"id": featureImage[0]['id'],"product_id": data.id,"position": featureImage[0]['position'],"created_at": "","updated_at": "","alt": null,"width": featureImage[0]['width'], "height": featureImage[0]['height'], "src": featureImage[0]['src'], "variant_ids": [variant.id]}} else {variant.featured_image = '';};};var self = bcsffilter;var itemJson = {"id": data.id,"title": data.title,"handle": data.handle,"vendor": data.vendor,"variants": data.variants,"url": self.buildProductItemUrl(data),"options_with_values": data.options_with_values,"images": data.images,"images_info": data.images_info,"available": data.available,"price_min": data.price_min,"price_max": data.price_max,"compare_at_price_min": data.compare_at_price_min,"compare_at_price_max": data.compare_at_price_max};return itemJson;};
BCSfFilter.prototype.prepareProductData=function(data){var self=this;var countData=data.length;for(var k=0;k<countData;k++){data[k]["images"]=data[k]["images_info"];if(data[k]["images"].length>0){data[k]["featured_image"]=data[k]["images"][0]}else{data[k]["featured_image"]={src:bcSfFilterConfig.general.no_image_url,width:"",height:"",aspect_ratio:0}}data[k]["url"]="/products/"+data[k].handle;var optionsArr=[];var countOptionsWithValues=data[k]["options_with_values"].length;for(var i=0;i<countOptionsWithValues;i++){optionsArr.push(data[k]["options_with_values"][i]["name"])}data[k]["options"]=optionsArr;var firstVariant=data[k]["variants"][0];var isRoundedPrice=true;if(firstVariant.hasOwnProperty("fulfillment_service")&&firstVariant.fulfillment_service=="gift_card"){isRoundedPrice=false}if(typeof self.convertPriceBasedOnActiveCurrency!=="undefined"){data[k].price_min=self.convertPriceBasedOnActiveCurrency(data[k].price_min,isRoundedPrice);data[k].price_max=self.convertPriceBasedOnActiveCurrency(data[k].price_max,isRoundedPrice);data[k].compare_at_price_min=self.convertPriceBasedOnActiveCurrency(data[k].compare_at_price_min,isRoundedPrice);data[k].compare_at_price_max=self.convertPriceBasedOnActiveCurrency(data[k].compare_at_price_max,isRoundedPrice)}data[k]["price_min"]*=100,data[k]["price_max"]*=100;if(data[k]["compare_at_price_min"]!=null){data[k]["compare_at_price_min"]*=100}if(data[k]["compare_at_price_max"]!=null){data[k]["compare_at_price_max"]*=100}data[k]["price"]=data[k]["price_min"];data[k]["compare_at_price"]=data[k]["compare_at_price_min"];data[k]["price_varies"]=data[k]["price_min"]!=data[k]["price_max"];if(getParam("variant")!==null&&getParam("variant")!=""){var paramVariant=data[k]["variants"].filter(function(e){return e.id==getParam("variant")});if(typeof paramVariant[0]!=="undefined")firstVariant=paramVariant[0]}else{var countVariants=data[k]["variants"].length;for(var i=0;i<countVariants;i++){if(data[k]["variants"][i].available){firstVariant=data[k]["variants"][i];break}}}data[k]["selected_or_first_available_variant"]=firstVariant;var countVariants=data[k]["variants"].length;for(var i=0;i<countVariants;i++){var variantOptionArr=[];var count=1;var variant=data[k]["variants"][i];var variantOptions=variant["merged_options"];if(Array.isArray(variantOptions)){var countVariantOptions=variantOptions.length;for(var j=0;j<countVariantOptions;j++){var temp=variantOptions[j].split(":");data[k]["variants"][i]["option"+(parseInt(j)+1)]=temp[1];data[k]["variants"][i]["option_"+temp[0]]=temp[1];variantOptionArr.push(temp[1])}data[k]["variants"][i]["options"]=variantOptionArr}if(data[k]["variants"][i]["compare_at_price"]!=null){var variantCompareAtPrice=parseFloat(data[k]["variants"][i]["compare_at_price"]);if(typeof self.convertPriceBasedOnActiveCurrency!=="undefined"){variantCompareAtPrice=self.convertPriceBasedOnActiveCurrency(variantCompareAtPrice,isRoundedPrice)}data[k]["variants"][i]["compare_at_price"]=variantCompareAtPrice*100}var variantPrice=parseFloat(data[k]["variants"][i]["price"]);if(typeof self.convertPriceBasedOnActiveCurrency!=="undefined"){variantPrice=self.convertPriceBasedOnActiveCurrency(variantPrice,isRoundedPrice)}data[k]["variants"][i]["price"]=variantPrice*100}data[k]["description"]=data[k]["content"]=data[k]["body_html"];if(data[k].hasOwnProperty("original_tags")&&data[k]["original_tags"].length>0){data[k]["tags"]=data[k]["original_tags"].slice(0)}data[k]["json"]=customizeJsonProductData(data[k])}return data};