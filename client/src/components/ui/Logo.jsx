const Logo = () => {
    return (
        <div className="flex p-5 justify-start items-center gap-2">
            <svg
                id="chat-logo"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="32" cy="32" r="30" stroke="#8338ec" strokeWidth="4" fill="#e0e0e0" />
                <path
                    d="M16 24C16 22.3431 17.3431 21 19 21H45C46.6569 21 48 22.3431 48 24V40C48 41.6569 46.6569 43 45 43H19C17.3431 43 16 41.6569 16 40V24Z"
                    fill="#8338ec"
                />
                <path
                    d="M32 37C29.7909 37 28 35.2091 28 33C28 30.7909 29.7909 29 32 29C34.2091 29 36 30.7909 36 33C36 35.2091 34.2091 37 32 37Z"
                    fill="#fff"
                />
                <path
                    d="M32 23C29.7909 23 28 21.2091 28 19C28 16.7909 29.7909 15 32 15C34.2091 15 36 16.7909 36 19C36 21.2091 34.2091 23 32 23Z"
                    fill="#fff"
                />
                <path
                    d="M40 23C37.7909 23 36 21.2091 36 19C36 16.7909 37.7909 15 40 15C42.2091 15 44 16.7909 44 19C44 21.2091 42.2091 23 40 23Z"
                    fill="#fff"
                />
            </svg>
            <span className="text-3xl font-semibold">ChatSphere</span>
        </div>
    );
};

export default Logo;
