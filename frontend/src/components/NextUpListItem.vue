<template>
    <li>
        <div class="summary">{{ calendarItem.summary || '(Kein Titel)' }}</div>
        <div class="date">{{ dateText }}</div>
        <span class="description" v-if="calendarItem.description">{{ calendarItem.description }}</span>
    </li>
</template>

<script>
    export default {
        name: "NextUpListItem",
        data() {
            return {
                dateText: ''
            }
        },
        computed: {
            minutes() {
              return this.$root.$data.minutes;
            },
        },
        props: {
            calendarItem: {
              type: Object,
              required: true,
            }
        },
        watch: {
            minutes: {
              handler: function () {
                if (this.calendarItem.allDayEvent) {
                  // Show the date without the time (which is always 00:00)
                  this.dateText = this.$moment(this.calendarItem.startDate).calendar({
                    sameDay: '[Heute]',
                    nextDay: '[Morgen]',
                    nextWeek: 'dddd',
                    lastDay: '[Gestern]',
                    lastWeek: '[Letzten] dddd',
                    sameElse: 'L'
                  })
                } else {
                  this.dateText = this.$moment(this.calendarItem.startDate).calendar()
                }
              },
              immediate: true
            }
        },
    }
</script>

<style scoped>
    li {
        display: flex;
        justify-content: space-between;
        background-color: #ddd;
        border-bottom: 1px solid #999;
        list-style: none;
        padding: 1em;
        color: #222222;
    }

    .date {
        margin-left: 0.5em;
        text-align: end;
    }

    .summary {
        font-weight: bold;
    }

    .description {
        white-space: pre-line;
    }
</style>
