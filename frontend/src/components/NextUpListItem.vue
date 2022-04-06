<template>
    <li>
        <div class="date">{{ theDate }}</div>
        <span class="summary">{{ calendarItem.summary || '(Kein Titel)' }}</span>
        <span class="description">{{ calendarItem.description }}</span>
    </li>
</template>

<script>
    export default {
        name: "NextUpListItem",
        computed: {
            theDate() {
                return this.$moment(this.calendarItem.startDate).calendar()
            },
        },
        props: {
            calendarItem: {
              type: Object,
              required: true,
            }
        },
    }
</script>

<style scoped>
    li {
        background-color: #ddd;
        border-bottom: 1px solid #999;
        list-style: none;
        padding: 1em;
        color: #222222;
    }

    .date {
        float: right;
        margin-left: 0.5em;
        white-space: pre-line;
        text-align: right;
    }

    .summary {
        display: block;
        font-weight: bold;
        margin-bottom: 0.2em;
    }

    .description {
        white-space: pre-line;
    }
</style>
