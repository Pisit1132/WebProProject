<template>
    <div class="events-page container-fluid text-light py-5" style="background-color: #010922;">
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
              <li v-if="!isLoggedIn" class="nav-item">
                <router-link class="nav-link" to="/signup">Sign-up</router-link>
              </li>
              <li v-if="!isLoggedIn" class="nav-item">
                <router-link class="nav-link" to="/login">Login</router-link>
              </li>
              <li v-if="isLoggedIn" class="nav-item">
                <button class="nav-link btn btn-link" @click="logout">Logout</button>
              </li>
              <li v-if="isLoggedIn" class="nav-item">
                <router-link class="nav-link" to="/profile">{{ userName }}</router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="row justify-content-center">
        <div class="col-md-10">
          <h1>YOU HAVE {{ events.length }} AVAILABLE MATCHES {{ userName }}</h1>
          <div v-for="event in events" :key="event._id" class="event-card">
            <img :src="event.image" alt="Event Image" class="event-image">
            <div class="event-details">
              <p>CLUB: {{ event.name }}</p>
              <p>MATCH: {{ event.match }}%</p>
              <p>DATE: {{ event.date }}</p>
              <p>STATUS: {{ event.status }}</p>
              <p>PRICE: {{ event.price }}</p>
              <router-link :to="{ name: 'booking', params: { id: event._id } }" class="btn btn-outline-warning">Book</router-link>
              <button class="btn btn-outline-danger" @click="deleteEvent(event._id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EventsPage',
    data() {
      return {
        events: [],
        userName: localStorage.getItem('userName'),
        isLoggedIn: !!localStorage.getItem('token')
      };
    },
    async created() {
      try {
        const response = await fetch('http://localhost:3000/events', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        this.events = await response.json();
      } catch (error) {
        console.error('Error:', error.message);
      }
    },
    methods: {
      async deleteEvent(eventId) {
        try {
          const response = await fetch(`http://localhost:3000/events/${eventId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            throw new Error('Failed to delete event');
          }
          this.events = this.events.filter(event => event._id !== eventId);
        } catch (error) {
          console.error('Error deleting event:', error.message);
        }
      },
      logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  .events-page h1 {
    color: #fff;
    text-align: center;
    margin-bottom: 30px;
  }
  
  .event-card {
    background-color: #33383A;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 20px;
  }
  
  .event-image {
    width: 100px;
    height: 100px;
  }
  
  .event-details {
    display: inline-block;
    vertical-align: top;
    margin-left: 20px;
  }
  
  .event-details p {
    margin: 5px 0;
  }
  </style>
  