<template>
    <div>
        <div>
            <label class="lbl">{{title}}</label>
            <label>
                <gmap-autocomplete v-model="placeDir != '' ? placeDir : placeDir" class="form-control" @place_changed="setPlace" @change="addMarker"></gmap-autocomplete>
                <!--v-text-field v-model="place.name" prepend-icon="email" name="name" label="Dirección" type="text"></v-text-field-->
            </label>
            <br/>
        </div>
        <br>
        <gmap-map
            :center="center" :zoom="12"
            style="width:100%;  height: 400px;">
            <gmap-marker
                :position="marker.position"
                @click="move()">
            </gmap-marker>
        </gmap-map>
    </div>
</template>
<script>
export default {
    name: "GoogleMap",
    props:['title', 'direct', 'coords'],
    data() {
        return {
            center: { lat: 45.508, lng: -73.587 },
            marker: {},
            places: [],
            currentPlace: null,
            placeDir:"",
            placeN:""
        };
    },
    watch:{
        placeDir(val){
            if(val && val.data){
                this.placeDir = val.data;
            }
        }
    },
    mounted() {
        this.geolocate();
        if(this.coords){
            var marke = {
                lat: Number(this.coords.lat),
                lng: Number(this.coords.long)
            };
            this.marker.position = marke;
            this.center = marke;
            var obj = {
                "name":this.direct,
                "position":marke
            }
            this.$emit("setAddress", obj);
        }
        if(this.direct)
            this.placeDir = this.direct;
    },
    methods: {
        setPlace(place) {
            this.currentPlace = place;
            this.addMarker();
        },
        move(){
            this.center = this.marker.position
        },
        addMarker() {
            if (this.currentPlace) {
                console.log(this.currentPlace)
                const marker = {
                    lat: this.currentPlace.geometry.location.lat(),
                    lng: this.currentPlace.geometry.location.lng()
                };
                this.marker.position = marker;
                this.places.push(this.currentPlace);
                this.center = marker;
                var obj = {
                    "name":this.currentPlace.name,
                    "position":marker
                }
                this.placeDir = this.currentPlace.name;
                this.currentPlace = null;
                this.$emit("setAddress", obj);
            }
        },
        geolocate: function() {
            navigator.geolocation.getCurrentPosition(position => {
                this.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
        });
        }
    }
};
</script>
<style>
    input.form-control{
        -webkit-writing-mode: horizontal-tb !important;
        text-rendering: auto !important;
        color: initial !important;
        letter-spacing: normal !important;
        word-spacing: normal !important;
        text-transform: none !important;
        text-indent: 0px !important;
        text-shadow: none !important;
        display: inline-block !important;
        text-align: start !important;
        -webkit-appearance: textfield !important;
        background-color: white !important;
        -webkit-rtl-ordering: logical !important;
        cursor: text !important;
        margin: 0em !important;
        padding: 1px 0px !important;
        border-width: 2px !important;
        border-style: inset !important;
        border-color: initial !important;
        border-image: initial !important;
        flex: 1 1 auto !important;
        line-height: 20px !important;
        padding: 8px 0 !important;
        max-width: 100% !important;
        min-width: 0 !important;
        width: 100% !important;
        background-color: transparent !important;
        border-style: none !important;
        color: rgba(0,0,0,.87) !important;
        box-sizing: inherit !important;
        border-radius: 0 !important;
        font-size:16px !important;
    }    
    .lbl{
        font-size:16px !important;
    }
</style>