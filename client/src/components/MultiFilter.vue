<template>
<div class='filter-wrap'>
    <span class='filter-title'>Фильтр:</span>
    <div class="mr-3">
        <p class='filter-subtitle'>По категории</p>
        <b-form-select @change="changeFilter()" v-model="categories" :options="options_category" size="sm"></b-form-select>
    </div>
    <div class="mr-3">
        <p class='filter-subtitle'>По статусу</p>
        <b-form-select @change="changeFilter()" v-model="action_type" :options="options_status" size="sm"></b-form-select>
    </div>
    <div>
        <p class='filter-subtitle'>По типу</p>
        <b-form-select @change="changeFilter()" v-model="prev" :options="options_type" size="sm"></b-form-select>
    </div>
</div>
</template>

<script>
export default {
    name: 'MultiFilter',
    props: ['filterChannels'],
    data() {
        return {
            categories: [{
                categories: {
                    $elemMatch: {
                        $eq: "Прогнозы и ставки"
                    }
                }
            }, {
                categories: {
                    $size: 0
                }
            }],
            action_type: null,
            prev: null,
            options_category: [{
                    value: [{
                        categories: {
                            $elemMatch: {
                                $eq: "Прогнозы и ставки"
                            }
                        }
                    }, {
                        categories: {
                            $size: 0
                        }
                    }],
                    text: 'Все'
                },
                {
                    value: [{
                        categories: {
                            $elemMatch: {
                                $eq: "Прогнозы и ставки"
                            }
                        }
                    }],
                    text: 'Прогнозы и ставки'
                }, {
                    value: [{
                        categories: {
                            $size: 0
                        }
                    }],
                    text: 'Без катеорий'
                }
            ],

            options_status: [{
                value: null,
                text: 'Все'
            }, {
                value: [{
                    action_type: {
                        $exists: false
                    }
                }],
                text: 'Не отмечен'
            }, {
                value:[{action_type:'watched'}] ,
                text: 'Просмотренный'
            }, {
                value:[{action_type:'need_to_work'}],
                text: 'В работу'
            }, {
                value: [{action_type:'completed'}],
                text: 'Проработанные'
            }],
            options_type: [{
                    value: null,
                    text: 'Все'
                }, {
                    value: [{prev:{
                        $exists: true
                    }}],
                    text: 'Измененный'
                },
                {
                    value: [{prev:{
                        $exists: false
                    }}],
                    text: 'Новый'
                },
            ]
        }
    },
    methods: {
        changeFilter() {
            let data = {
                $and: []
            }
            if (this.categories) {
                data.$and.push({
                    $or: this.categories
                })
            }
            if (this.action_type) {
                data.$and.push({
                    $or: this.action_type
                })
            }
            if (this.prev) {
                data.$and.push({
                    $or: this.prev
                })
            }

            console.log(data)
            this.filterChannels(data)
        }
    }
}
</script>

<style>
.filter-wrap {
    display: flex;
    width: 50%;
    margin: 20px 0 20px 20px;
    align-items: center;
}

.filter-title {
    margin-right: 20px;
    font-weight: bold;
}

.filter-subtitle {
    font-size: 12px;
    margin: 5px 0;
}
</style>
