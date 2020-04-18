module.exports = {
    //Proxy helper

    proxyUrl() {
        const getRandomNumber = (min, max) => {
            let rand = min + Math.random() * (max + 1 - min);
            return Math.floor(rand);
        }

        const hosts = ['193.233.72.246',
            '91.200.150.128',
            '91.200.150.194',
            '45.86.180.201',
            '45.86.180.173',
            '45.137.190.6',
            '194.67.210.235',
            '5.8.76.209',
            '5.8.76.197',
            '89.223.100.122',
            '89.223.100.119',
            '45.134.27.178',
            '193.9.60.181',
            '194.1.239.225',
            '45.84.225.179',
            '45.84.225.180',
            '193.32.188.230',
            '193.32.188.113',
            '45.139.186.110',
            '45.139.186.97',
            '185.147.129.109',
            '81.177.22.136',
            '81.177.26.230',
            '185.66.12.229',
            '185.128.212.46',]
        const proxy = {
            port: '27525',
            user: "EPjErwx9M0",
            password: "borovenko1996"
        }
        return "http://" + proxy.user + ":" + proxy.password + "@" + hosts[getRandomNumber(0, hosts.length)] + ":" + proxy.port
    }

}