<template>
    <button type="button" class="button" @click="path ? $router.push(path) : $router.go(-1)">
            <span class="icon">
                <font-awesome-icon icon="chevron-left"/>
            </span>
        <span>Zurück</span>
    </button>
</template>
<script>
import { RawLocation } from 'vue-router'

export default {
  name: 'BackButton',
  props: {
    path: RawLocation
  }
}
</script>
