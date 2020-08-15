<script context="module">
  export async function postData(url, data, token) {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data)
    });
    return response.json();
  }
</script>

<script>
  import { user, successMessage, failureMessage } from "./stores/authstore.js";
  import Router, { push } from "svelte-spa-router";
  import Navbar from "./components/ui/Navbar.svelte";
  import Footer from "./components/ui/Footer.svelte";
  import Landing from "./components/pages/Landing.svelte";
  import Signup from "./components/auth/Signup.svelte";
  import Login from "./components/auth/Login.svelte";
  import ChangePassword from "./components/auth/ChangePassword.svelte";
  import RequestPasswordReset from "./components/auth/RequestPasswordReset.svelte";
  import AddPost from "./components/pages/AddPost.svelte";
  import PostDetail from "./components/pages/PostDetail.svelte";

  let routes = {
    "/": Landing,
    "/signup": Signup,
    "/login": Login,
    "/changepassword": ChangePassword,
    "/requestpasswordreset": RequestPasswordReset,
    "/addpost": AddPost,
    "/posts/detail/:id": PostDetail
  };
</script>

<style>
  main {
    padding: 1em;
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
  }
</style>

<main>
  {#if $successMessage}
    <p>{$successMessage}</p>
  {/if}
  <Navbar />
  <Router {routes} />
  <Footer />
</main>
