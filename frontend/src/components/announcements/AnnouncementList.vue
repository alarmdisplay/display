<template>
    <div class="gridview-component">
        <div class="announcement-list">
            <p class="header">{{ options.title || 'Bekanntmachungen' }}</p>
            <ul v-if="activeAnnouncements.length > 0">
                <Item v-for="announcement in activeAnnouncements" v-bind:key="announcement.id"
                      v-bind:announcement="announcement"/>
            </ul>
            <div v-else class="no-announcements">
                <div class="icon-and-text">
                    <font-awesome-icon icon="bullhorn" size="2x"/>
                    <p>Keine Bekanntmachungen</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Item from "@/components/announcements/Item";
    import {makeFindMixin} from "feathers-vuex";
    export default {
        name: "AnnouncementList",
        components: {
            Item
        },
        computed: {
            activeAnnouncements: function () {
                // Return all announcements that are currently valid or do not have validity information
                return this.announcements.filter(announcement => {
                    return (!announcement.validFrom || Math.floor(announcement.validFrom.valueOf() / 1000) <= this.$root.$data.seconds) &&
                        (!announcement.validTo || Math.floor(announcement.validTo.valueOf() / 1000) >= this.$root.$data.seconds)
                })
            },
            announcementsParams() {
                return { query: {} }
            }
        },
        mixins: [
            makeFindMixin({
                service: 'announcements',
                name: 'announcements',
                params: 'announcementsParams'
            })
        ],
        props: {
            instanceId: Number,
            options: Object
        }
    }
</script>

<style scoped>
    .announcement-list {
        box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19);
        background-color: #cccccc;
        text-align: start;
        height: 100%;
        overflow: hidden;
    }

    .header {
        background-color: #393939;
        box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19);
        color: #ddd;
        font-weight: bolder;
        margin: 0;
        padding: 1em;
        text-align: center;
    }

    ul {
        margin: 0;
        padding: 0;
    }

    .no-announcements {
        color: #393939;
        height: 100%;
        font-size: 2vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: -5vh;
    }

    .no-announcements .icon-and-text {
        text-align: center;
    }
</style>
