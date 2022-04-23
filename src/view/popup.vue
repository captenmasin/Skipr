<template>
    <div class="main_app">
        <div class="p-4">
            <div>
                <div class="relative">
                    <h1 class="font-bold text-lg">
                        New rule
                    </h1>
                    <div class="flex space-x-4 pr-16">
                        <select v-model="subject"
                                class="w-4/12 w-4/12 border border-gray-200 rounded-lg text-base p-2 px-3 focus:outline-none">
                            <option>Subject</option>
                            <option value="date">Published date</option>
                            <option value="title">Title</option>
                            <option value="channel">Channel</option>
                        </select>
                        <select v-if="subject === 'date'" v-model="modifier"
                                class="w-4/12 w-4/12 border border-gray-200 rounded-lg text-base p-2 px-3 focus:outline-none">
                            <option>Modifier</option>
                            <option value="newer_than">Newer than</option>
                            <option value="older_than">Older than</option>
                        </select>
                        <select v-if="subject !== 'date'" v-model="modifier"
                                class="w-4/12 w-4/12 border border-gray-200 rounded-lg text-base p-2 px-3 focus:outline-none">
                            <option>Modifier</option>
                            <option value="starts_with">Starts with</option>
                            <option value="ends_with">End with</option>
                            <option value="contains">Contains</option>
                            <option value="equals">Equals</option>
                            <option value="not_equals">Does not equal</option>
                        </select>
                        <input v-if="subject !== 'date'" type="text" v-model="string" placeholder="String"
                               class="w-4/12 border border-gray-200 rounded-lg text-base p-2 px-3 focus:outline-none"/>
                        <input v-if="subject === 'date'" type="date" v-model="string" placeholder="Date"
                               class="w-4/12 border border-gray-200 rounded-lg text-base p-2 px-3 focus:outline-none"/>
                    </div>
                    <div class="flex flex-col pr-16 space-y-2">
                        <div class="flex space-x-4" v-for="(andRule, index) in and" :key="index">
                            <select v-model="andRule.subject"
                                    class="w-4/12 w-4/12 border border-gray-200 rounded-lg text-base p-2 px-3 focus:outline-none">
                                <option>Subject</option>
                                <option value="date">Published date</option>
                                <option value="title">Title</option>
                                <option value="channel">Channel</option>
                            </select>
                            <select v-if="andRule.subject === 'date'" v-model="andRule.modifier"
                                    class="w-4/12 w-4/12 border border-gray-200 rounded-lg text-base p-2 px-3 focus:outline-none">
                                <option>Modifier</option>
                                <option value="newer_than">Newer than</option>
                                <option value="older_than">Older than</option>
                            </select>
                            <select v-if="andRule.subject !== 'date'" v-model="andRule.modifier"
                                    class="w-4/12 w-4/12 border border-gray-200 rounded-lg text-base p-2 px-3 focus:outline-none">
                                <option>Modifier</option>
                                <option value="starts_with">Starts with</option>
                                <option value="ends_with">End with</option>
                                <option value="contains">Contains</option>
                                <option value="equals">Equals</option>
                                <option value="not_equals">Does not equal</option>
                            </select>
                            <input v-if="andRule.subject !== 'date'" type="text" v-model="andRule.string" placeholder="String"
                                   class="w-4/12 border border-gray-200 rounded-lg text-base p-2 px-3 focus:outline-none"/>
                            <input v-if="andRule.subject == 'date'" type="date" v-model="andRule.string" placeholder="Date"
                                   class="w-4/12 border border-gray-200 rounded-lg text-base p-2 px-3 focus:outline-none"/>
                        </div>
                        <button @click="and.push({subject: '', modifier: '', string: ''})"
                                class="absolute bottom-2 mt-2 rounded-full right-0 text-gray-200 hover:text-gray-500">
                            <svg class="w-6 h-6 -mb-1" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                      clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="mt-4">
                    <input type="number" v-model="seconds" placeholder="Skip (seconds)"
                           class="w-4/12 border border-gray-200 rounded-lg text-sm p-2 px-2 focus:outline-none"/>

                    <button @click="saveRule()" class="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">
                        Save
                    </button>
                </div>
                <div v-if="rules && typeof rules !=='undefined' && rules.length > 0">
                    <h1 class="font-bold text-lg mt-8">
                        Current rules
                    </h1>
                    <div class="divide-y divide-gray-100 mb-4">
                        <div class="flex flex-col">
                            <div class="flex w-full" v-for="(rule, index) in rules" :key="index">
                                <div class="flex-1 py-2">
                                <span class="font-mono bg-gray-100 p-1 text-xs">
                                    <span v-text="rule.subject + ' '"></span>
                                    <span v-text="rule.modifier + ' '"></span>
                                    "<span v-text="rule.string"></span>"
                                </span>
                                    <span v-for="(andRule, andIndex) in rule.and" :key="andIndex">
                                    <strong class="ml-1">AND</strong>
                                    <span class="font-mono bg-gray-100 p-1 text-xs">
                                        <span v-text="andRule.subject + ' '"></span>
                                        <span v-text="andRule.modifier + ' '"></span>
                                        "<span v-text="andRule.string"></span>"
                                    </span>
                                </span>
                                    <div class="bg-blue-500 text-xs p-1 rounded-sm text-white inline-block">
                                        <span>skip </span>
                                        <span v-text="rule.seconds + ' '"></span>
                                        <span>seconds</span>
                                    </div>
                                </div>
                                <div class="flex-0 py-2">
                                    <button class="flex-0 text-red-500 rounded-full p-1 hover:bg-red-500 hover:text-white"
                                            @click="deleteRule(rule.id)">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end">
                        <button @click="deleteRules" class="bg-white hover:text-white hover:bg-red-500 text-red-500 px-3 py-2 rounded-md text-sm font-medium mt-4 mr-0">
                            Delete all
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'popupView',
    data() {
        return {
            query: '',
            subject: 'title',
            modifier: 'starts_with',
            string: '',
            seconds: '',
            rules: [],
            and: []
        }
    },
    methods: {
        saveRule() {
            var query = {};
            query.subject = this.subject;
            query.modifier = this.modifier;
            query.string = this.string;
            query.seconds = this.seconds;
            query.and = JSON.parse(JSON.stringify(this.and))
            query.id = Math.floor(Date.now() / 1000);
            chrome.storage.sync.get("skipr_rules", (items) => {
                var currentRules = [];
                if (typeof items.skipr_rules !== 'undefined') {
                    currentRules = items.skipr_rules;
                }
                currentRules.push(query);
                this.rules = currentRules;
                chrome.storage.sync.set({"skipr_rules": currentRules}, function () {
                    this.rules = currentRules;
                    this.subject = ''
                    this.modifier = ''
                    this.string = ''
                    this.seconds = ''
                    this.and = []
                });
            });
        },
        deleteRule(id) {
            chrome.storage.sync.get("skipr_rules", (items) => {
                var currentRules = items.skipr_rules;
                currentRules = currentRules.filter(function (obj) {
                    return obj.id !== id;
                });
                this.rules = currentRules;
                chrome.storage.sync.set({"skipr_rules": currentRules}, function () {
                    this.rules = currentRules;
                });
            });
        },
        deleteRules() {
            chrome.storage.sync.set({"skipr_rules": []}, () => {
                this.rules = [];
            });
        }
    },
    mounted() {
        chrome.storage.sync.get("skipr_rules", (items) => {
            this.rules = items.skipr_rules;
        });
    }
}

</script>

<style>
@import '../assets/tailwind.css';

.main_app {
    width: 800px;
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    /*-webkit-font-smoothing: antialiased;*/
    /*-moz-osx-font-smoothing: grayscale;*/
    /*text-align: center;*/
    /*color: #2c3e50;*/
    /*margin-top: 60px;*/
}
</style>
