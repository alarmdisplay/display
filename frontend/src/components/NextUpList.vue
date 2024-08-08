<template>
    <div class="gridview-component">
        <div class="next-up-list">
            <p class="header">{{ options.title || 'Termine' }}</p>
            <FeathersVuexFind
                v-slot="{ items: calendarItems }"
                service="calendar-items"
                :params="{ query: { $sort: { startDate: 1 }, $limit: 25 } }"
                :qid="`nextUpList-${instanceId}`"
                watch="query"
            >
                <ul v-if="calendarItems.length > 0">
                    <NextUpListItem
                        v-for="calendarItem of calendarItems"
                        :calendar-item="calendarItem"
                        :key="calendarItem.uid"
                    />
                </ul>
                <div v-else class="no-calendar-items">
                    <div class="icon-and-text">
                        <font-awesome-icon icon="calendar" size="2x"/>
                        <p>Keine Termine</p>
                    </div>
                </div>
            </FeathersVuexFind>
        </div>
    </div>
</template>

<script>
    import NextUpListItem from '@/components/NextUpListItem'

    export default {
        name: "NextUpList",
        components: { NextUpListItem },
        props: {
            instanceId: Number,
            options: {
              type: Object,
              default: () => {},
            }
        }
    }
</script>

<style scoped>
    .next-up-list {
        box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19);
        background-color: #cccccc;
        text-align: start;
        height: 100%;
        overflow: hidden;
    }

    .header {
        background-color: #aa050d;
        box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19);
        color: #ddd;
        font-size: 1.5em;
        font-weight: bolder;
        margin: 0;
        padding: 0.4em;
        text-align: center;
    }

    ul {
        margin: 0;
        padding: 0;
    }

    .no-calendar-items {
        color: #393939;
        height: 100%;
        font-size: 2vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: -5vh;
    }

    .no-calendar-items .icon-and-text {
        text-align: center;
    }
</style>
