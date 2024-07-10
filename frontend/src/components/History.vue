<template>
    <div class="history-page container-fluid text-light py-5" style="background-color: #010922;">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <router-link class="navbar-brand" to="/">EXCLUSIVE</router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <router-link class="nav-link" to="/about">About</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/events">Events</router-link>
              </li>
              <li class="nav-item">
                <button class="btn btn-outline-danger" @click="logout">Logout</button>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/profile">{{ userName }}</router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="container mt-5">
        <h2 class="text-center">YOUR HISTORY {{ userName }}</h2>
        <div v-if="history.length === 0" class="text-center">
          <p>No booking history found.</p>
        </div>
        <div v-else>
          <div v-for="booking in history" :key="booking._id" class="card bg-dark text-light p-4 mb-3">
            <div class="row">
              <div class="col-md-4">
                <img :src="booking.eventId.image" alt="Event Image" class="img-fluid">
              </div>
              <div class="col-md-8">
                <h3>CLUB: {{ booking.eventId.name }}</h3>
                <p>MATCH: {{ booking.eventId.match }}%</p>
                <p>DATE: {{ booking.eventId.date }}</p>
                <p>STATUS: <span :class="booking.eventId.status === 'AVAILABLE' ? 'text-success' : 'text-danger'">{{ booking.eventId.status }}</span></p>
                <button class="btn btn-warning" @click="rebook(booking.eventId._id)">RE-BOOK</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        history: []
      };
    },
    created() {
      this.fetchHistory();
    },
    methods: {
      async fetchHistory() {
        try {
          const response = await fetch('http://localhost:3000/history', {
            method: 'GET',
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch history');
          }
  
          const data = await response.json();
          this.history = data;
        } catch (error) {
          console.error('Error fetching history:', error);
          alert(error.message);
        }
      },
      rebook(eventId) {
        this.$router.push(`/booking/${eventId}`);
      },
      logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.$router.push('/');
      }
    },
    computed: {
      userName() {
        return localStorage.getItem('user');
      }
    }
  };
  </script>
  
  <style scoped>
  .history-page {
    background-color: #010922;
  }
  </style>
  