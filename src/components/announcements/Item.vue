<template>
    <li>
        <span class="title" v-if="announcement.title !== ''">{{ announcement.title }}</span>
        <span class="text">{{ announcement.text }}</span>
        <div class="date">{{ theDate }}</div>
    </li>
</template>

<script>
    export default {
        name: "Item",
        computed: {
            theDate: function () {
                let date = new Date(this.announcement.updatedAt || this.announcement.createdAt);
                if (isNaN(date.valueOf())) {
                    return ''
                }
                return this.$moment(date).format("LL")
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

    .date {
        text-align: right;
    }

    .title {
        display: block;
        font-size: large;
        font-weight: bold;
        margin-bottom: 0.2em;
    }
</style>
