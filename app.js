// app.js

const NYTBaseUrl = "https://api.nytimes.com/svc/topstories/v2/";
const ApiKey = "4197a0cce3944c77a46687eda3973e0c";
const SECTIONS = "world, arts, automobiles, books, business, fashion, food";


function buildUrl (url) {
    return NYTBaseUrl + url + ".json?api-key=" + ApiKey
}

Vue.component('news-list', {
    props: ['results'], 
    template: `
        <section>
            <div class="row" v-for="posts in processedPosts">
                <div class="columns medium-3" v-for="post in posts">
                    <div class="card">

                    <a :href="post.url" target="_blank"><img :src="post.image_url"></a>

                    <p class="card-section text-center">
                        <small>{{ post.section }}</small><br>
                        <strong>
                            <a :href="post.url" target="_blank">{{ post.title }}</a>
                        </strong> <br>
                        {{ post.abstract }}
                    </p>
        
                </div>
            </div>
        </div>
      </section>
    `,
    computed: {
        processedPosts() {
            let posts = this.results;

            // Add image_url attribute
            posts.map(post => {
                let imgObj = post.multimedia.find(media => media.format === "superJumbo");
                post.image_url = imgObj ? imgObj.url : "http://placehold.it/300x200?text=N/A";
            });

            // Put Array into Chunks
            let i, j, chunkedArray = [], chunk = 4;
            for (i = 0, j = 0; i < posts.length; i += chunk, j++) {
                chunkedArray[j] = posts.slice(i, i+chunk);
            }
            return chunkedArray;
        }
    }
});


const vm = new Vue({
    el: '#app', 
    data: {
        results: [], 
        sections: SECTIONS.split(', '), 
        section: 'world',
    }, 
    mounted() {
        this.getPosts(this.section);
    },
    methods: {
        getPosts(section) {
            let url = buildUrl(section);
            axios.get(url).then(response => {
                this.results = response.data.results;
            }).catch( error => {console.log(error); });
        }
    }
});