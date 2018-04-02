import './css/index.css';
import './css/index2.css';
import './less/style.less';
new Vue({
    el: '#app',
    data: {
        url: 'begin now'
    },
    methods: {
        haha() {
            axios.post('http://127.0.0.1:3000/'+this.url)
                .then(res => {
                    console.log(res)
                })
        }
    }
})
