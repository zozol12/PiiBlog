<template>
    <header>
        <h1><nuxt-link to="/">PiiBlog</nuxt-link></h1>
        <nav>
            <ul>
                <li>
                    <nuxt-link to="/about">About</nuxt-link>
                </li>
                <li>
                    <nuxt-link to="/profile">Profile</nuxt-link>
                </li>
            </ul>
        </nav>
    </header>
    <div>
        <slot />
    </div>
    <footer>
        <!--  Social Buttons & copyright  -->
        <div class="social">
            <a href="https://twitter.com/piiblog" target="_blank" rel="noopener noreferrer">
                <img src="/favicon.ico" alt="Twitter" />
            </a>
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
                <img src="/favicon.ico" alt="RSS" />
            </a>
        </div>
        <p>&copy; 2023 PiiNut</p>
    </footer>
</template>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: #333;
        color: #fff;
    }
    nav ul {
        display: flex;
        list-style: none;
    }
    nav ul li {
        margin-left: 1rem;
    }
    nav ul li:first-child {
        margin-left: 0;
    }
    nav ul li a {
        color: #fff;
        text-decoration: none;
    }
    nav ul li a:hover {
        text-decoration: underline;
    }
    nav ul li a.active {
        text-decoration: underline;
    }
    main {
        padding: 1rem;
    }
    footer {
        padding: 1rem;
        background-color: #333;
        color: #fff;
    }   
</style>