<template>
    <li :class="{
      cancelled: calendarItem.status === 'cancelled',
      tentative: calendarItem.status === 'tentative'
    }">
        <div>
            <div class="summary">{{ calendarItem.summary || '(Kein Titel)' }}</div>
            <span class="description" v-if="calendarItem.description">{{ calendarItem.description }}</span>
        </div>
        <div class="date">{{ dateText }}</div>
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
                  let allDayFormat = {
                    sameDay: '[Heute]',
                    nextDay: '[Morgen]',
                    nextWeek: 'dddd',
                    lastDay: '[Gestern]',
                    lastWeek: '[Letzten] dddd',
                    sameElse: 'L'
                  }
                  this.dateText = this.$moment(this.calendarItem.startDate).calendar(allDayFormat)

                  // Subtract one second, because the end is at 00:00 of the following day
                  const endDate = this.calendarItem.endDate - 1000
                  const endDateText = this.$moment(endDate).calendar(allDayFormat)

                  // Is it a multi-day event?
                  if (this.dateText !== endDateText) {
                    this.dateText = `${this.dateText} - ${endDateText}`
                  }

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
        padding: 0.75em;
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

    .cancelled .summary, .cancelled .date {
        text-decoration-line: line-through;
        font-weight: normal;
    }

    .cancelled .description {
        display: none;
    }

    .tentative .summary::before {
        font-weight: normal;
        content: "Vorläufig: ";
    }
</style>
