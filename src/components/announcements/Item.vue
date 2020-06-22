<template>
    <li :class="getListItemClass()">
        <div class="date">{{ theDate }}</div>
        <span class="title" v-if="announcement.title !== ''">{{ announcement.title }}</span>
        <span class="text">{{ announcement.text }}</span>
    </li>
</template>

<script>
    export default {
        name: "Item",
        computed: {
            theDate: function () {
                let date = new Date(this.announcement.updatedAt);
                if (isNaN(date.valueOf())) {
                    return ''
                }
                return this.$moment(date).format("L")
            }
        },
        methods: {
            getListItemClass: function () {
                return this.announcement.important ? 'important' : ''
            }
        },
        props: {
            announcement: Object
        }
    }
</script>

<style scoped>
    li {
        background-color: #ddd;
        border-bottom: 1px solid #999;
        list-style: none;
        padding: 1em;
    }

    li.important {
        background-color: #c7ba53;
    }

    .date {
        float: right;
        margin-left: 0.5em;
    }

    .title {
        display: block;
        font-weight: bold;
        margin-bottom: 0.2em;
    }

    .text {
        white-space: pre-line;
    }
</style>
