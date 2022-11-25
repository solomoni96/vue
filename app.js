function randFormula(min, max) {
    return Math.floor(Math.random() *  (max - min)) + min
}

const app = Vue.createApp({
    data() {
        return {
            log: [],
            rounds: 0,
            surrendered: false,
            playerHealth: 100,
            monsterHealth: 100,
            winner: null
        }
    },
    computed: {
        monsterBar() {
            return {width: this.monsterHealth + '%'};
        },
        playerBar() {
            return {width: this.playerHealth + '%'};
        },
        gameOverMessage() {
            return this.surrendered ? "You surrender after " + this.rounds + " rounds. GAME OVER!" : ""
        },
        useableSpecial() {
            return this.rounds % 3 !== 0;
        }
    },
    watch: {
        playerHealth(health) {
            if(health <= 0 && this.monsterHealth <= 0) {
                this.winner = "Draw"
            } else if(health <= 0) {
                this.winner = "Monster"
            }
        },
        monsterHealth(health) {
            if(health <= 0 && this.monsterHealth <= 0) {
                this.winner = "Draw"
            } else if(health <= 0) {
                this.winner = "Player"
            }
        }
    },
    methods: {
        logAction(loggedBy, action, value) {
            this.log.push({
                who: loggedBy,
                action: action,
                message: value
            })
        },
        attackPlayer() {
            const attackValue = randFormula(8, 15);
            this.playerHealth -= attackValue;
            this.logAction('Monster', 'damage', 'deals ' + attackValue + ' to player')
        },
        attackMonster() {
            this.rounds++;
            const attackValue = randFormula(5, 12);
            this.monsterHealth -= attackValue;
            this.logAction('Player', 'damage', 'deals ' + attackValue + ' to monster')
            // Monster attacks back
            this.attackPlayer()   
        },
        specialAttack() {
            this.rounds++;
            const attackValue = randFormula(18, 24);
            this.monsterHealth -= attackValue;
            this.logAction('Player', 'damage', 'deals ' + attackValue + ' to monster')
            // Monster attacks back
            this.attackPlayer()   
        },
        heal() {
            this.rounds++;
            const healValue = randFormula(8, 15);
            if(this.playerHealth + healValue > 100) {
                this.playerHealth = 100
                this.logAction('Player', 'heal', 'full health restored')
            } else {
                this.playerHealth += healValue; 
                this.logAction('Player', 'heal', 'heals by ' + healValue)
            }
            // Monster attacks back
            this.attackPlayer()   
        },
        surrender() {
            this.playerHealth = 0;
            this.logAction('Player', 'surrender', 'has surrendered')
        },
        restart() {
            this.rounds = 0;
            this.winner = null
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.log = [];
        }
    }
});

app.mount('#game');
