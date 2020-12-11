window.ruleManager = function () {
    return {
        deleteRule(id) {
            chrome.storage.sync.get("skipr_rules", function (items) {
                var currentRules = items.skipr_rules;
                currentRules = currentRules.filter(function (obj) {
                    return obj.id !== id;
                });
                chrome.storage.sync.set({"skipr_rules": currentRules}, function () {
                    document.querySelector('[x-data]').__x.$data.rules = currentRules;
                });
            });
        },
        deleteRules() {
            chrome.storage.sync.set({"skipr_rules": []}, function () {
                document.querySelector('[x-data]').__x.$data.rules = [];
            });
        },
        saveRule() {
            var query = {};
            query.subject = this.subject;
            query.modifier = this.modifier;
            query.string = this.string;
            query.seconds = this.seconds;
            query.and = JSON.parse(JSON.stringify(document.querySelector('[x-data]').__x.$data.and))
            query.id = Math.floor(Date.now() / 1000);
            chrome.storage.sync.get("skipr_rules", function (items) {
                var currentRules = items.skipr_rules;
                currentRules.push(query);
                chrome.storage.sync.set({"skipr_rules": currentRules}, function () {
                    document.querySelector('[x-data]').__x.$data.rules = currentRules;
                    document.querySelector('[x-data]').__x.$data.subject = '';
                    document.querySelector('[x-data]').__x.$data.modifier = '';
                    document.querySelector('[x-data]').__x.$data.string = '';
                    document.querySelector('[x-data]').__x.$data.and = [];
                });
            });
        },
    }
}

chrome.storage.sync.get("skipr_rules", function (items) {
    document.querySelector('[x-data]').__x.$data.rules = items.skipr_rules;
});