<template>
    <div class="profile-page container-fluid text-light py-5" style="background-color: #010922;">
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
                <router-link class="nav-link" to="/history">Your History</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/profile">Profile</router-link>
              </li>
              <li v-if="isLoggedIn" class="nav-item">
                <button class="nav-link btn btn-link" @click="logout">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="row justify-content-center">
        <div class="col-md-10">
          <h1>PROFILE {{ userName }}</h1>
          <div class="profile-card">
            <div class="form-group">
              <label>Name:</label>
              <p>{{ profile.name }}</p>
            </div>
            <div class="form-group">
              <label>Description:</label>
              <p>{{ profile.description }}</p>
            </div>
            <div class="form-group">
              <label>Relationship Status:</label>
              <p>{{ profile.relationshipStatus }}</p>
            </div>
            <div class="form-group">
              <label>Music Preferences:</label>
              <p>{{ profile.musicPreferences.join(', ') }}</p>
            </div>
            <router-link to="/survey" class="btn btn-warning">Edit</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProfilePage',
    data() {
      return {
        profile: {
          name: '',
          description: '',
          relationshipStatus: '',
          musicPreferences: []
        },
        userName: localStorage.getItem('userName'),
        isLoggedIn: !!localStorage.getItem('token')
      };
    },
    async created() {
      try {
        const response = await fetch('http://localhost:3000/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        this.profile = data.profile;
      } catch (error) {
        console.error('Error:', error.message);
      }
    },
    methods: {
      logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  .profile-page h1 {
    color: #fff;
    text-align: center;
    margin-bottom: 30px;
  }
  
  .profile-card {
    background-color: #33383A;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .btn-warning {
    background-color: #FCE663;
    border: none;
    color: #000;
  }
  </style>
  