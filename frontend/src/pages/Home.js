import { useAuth } from "../components/AuthProvider";
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {

    return (
        <div>
            <div id="home" class="hero-area">
                <div class="bg-image bg-parallax overlay" style={{ backgroundImage: "url(https://i.imgur.com/YDwNPZg.jpg)" }}></div>
                <div class="home-wrapper">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-8">
                                <h1 class="title white-text">Tasks Scheduler</h1>
                                <p class="lead white-text description">Intrumentul esențial pentru organizare și notare.</p>
                                <p class="lead white-text description">O fuziune de funcționalități adjuvante mediului academic.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="about" class="section">
                <div class="container">
                    <div class="row">

                        <div class="col-md-6">
                            <div class="section-header">
                                <h2 className="title">Bine ai venit!</h2>
                                <p class="lead description">Această aplicație web este destinată studenților, având ca principal obiectiv sistematizarea și gestionarea orarului și a activităților lor academice.
                                    Această platformă oferă multiple funcționalități pentru a sprijini studenții în organizarea și monitorizarea eficientă a timpului lor, facilitând astfel gestionarea resurselor și îmbunătățind performanța academică.
                                </p>
                            </div>
                            <div class="feature">
                                <i class="feature-icon fas fa-school"></i>
                                <div class="feature-content">
                                    <a href="/departments">
                                        <h4>Orar </h4>
                                    </a>
                                    <p>Sistemul pune la dispoziția utilizatorilor o interfață intuitivă pentru crearea și gestionarea orarului academic. Utilizatorii pot adăuga și organiza materiile, modulele și activitățile extracurriculare într-un mod flexibil și ușor de utilizat.</p>
                                </div>
                            </div>
                            <div class="feature">
                                <i class="feature-icon fas fa-book-open"></i>
                                <div class="feature-content">
                                    <a href="/instructors">
                                        <h4>Activități variate</h4>
                                    </a>
                                    <p>O secțiune dedicată permite studenților să planifice și să urmărească activitățile zilnice și să-și gestioneze sarcinile și task-urile asociate. Fiecare activitate poate fi detaliată cu termene limită, priorități și alte informații relevante.
                                    </p>
                                </div>
                            </div>
                            <div class="feature">
                                <i class="feature-icon fas fa-pencil"></i>
                                <div class="feature-content">
                                    <a href="/sections">
                                        <h4>Note</h4>
                                    </a>
                                    <p>Platforma dispune de un modul specializat pentru calcularea mediei ponderate a notelor, oferind utilizatorilor posibilitatea de a introduce și actualiza notele obținute în diverse materii, iar apoi să obțină o medie ponderată în funcție de numărul de credite alocat fiecărei discipline.</p>
                                </div>
                            </div>
                            <div class="feature">
                                <i class="feature-icon far fa-graduation-cap"></i>
                                <div class="feature-content">
                                    <a href="/sections">
                                        <h4>Studenție</h4>
                                    </a>
                                    <p>Această aplicație web se dorește a fi un instrument central pentru gestionarea eficientă a timpului și resurselor studenților, oferindu-le un mediu digital prietenos și personalizabil pentru a-și organiza și îmbunătăți experiența academică.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="about-img">
                                <img src="https://i.imgur.com/qw0AWhu.png" alt=""></img>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div id="courses" class="section">
                <div class="container">
                    <div id='preloader'>
                        <div class='preloader'></div>
                    </div>
                    <script type="text/javascript" src="js/jquery.min.js"></script>
                    <script type="text/javascript" src="js/bootstrap.min.js"></script>
                    <script type="text/javascript" src="js/main.js"></script>
                </div>
            </div>
        </div>
    );
}

export default Home;