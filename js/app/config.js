define([], function () 
{
    var config = {};
    
    config.actionsUrl = "https://historian.audacious-software.com/historian/actions.json";
    config.uploadUrl = "https://historian.audacious-software.com/data/add-bundle.json";
    config.reviewUrl = "https://historian.audacious-software.com/historian/user/";
    config.fetchIdUrl = "https://historian.audacious-software.com/historian/fetch-id.json";
    config.categoriesUrl = "https://historian.audacious-software.com/historian/categories.json"; //default categories to get you started.
    config.sampleDataUrl = "https://historian.audacious-software.com/historian/sample-data.json";
    
    config.conditionUrl = function(participate, par, metadata) {
        var url = '';
        
        if (participate) {
            url += 'https://na?par=1' + '&conditionRcvd=';
            url += metadata['web_historian_condition'];
            url += '&idRcvd=';
            url += metadata['upload_identifier'];
            
        } else {
            url += 'https://american.co1.qualtrics.com/xxx/?par=0' + '&conditionRcvd=';
            url += metadata['web_historian_condition'];
            url += '&idRcvd=';
            url += metadata['upload_identifier'];
        }
        
        return url;
    }

    return config;
});
