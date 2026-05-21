/* ==========================================================================
   Beyond Frictionless Learning - Interactive App Logic
   Interactivity, Canvas Simulator, and Lesson Redesigner Planner
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. Theme Management (Light / Dark Mode)
  // ==========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (!systemPrefersDark) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Redraw canvas with new theme colors if simulator is running
    setTimeout(resizeCanvas, 100);
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // ==========================================================================
  // 2. Interactive Simulator (GPS vs. Map Cognitive Paths)
  // ==========================================================================
  const canvas = document.getElementById('sim-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const gpsBtn = document.getElementById('sim-btn-gps');
    const mapBtn = document.getElementById('sim-btn-map');
    
    const simFriction = document.getElementById('sim-val-friction');
    const simTime = document.getElementById('sim-val-time');
    const simRetention = document.getElementById('sim-val-retention');
    const simAgency = document.getElementById('sim-val-agency');
    const simExplain = document.getElementById('sim-explain-text');
    
    let currentMode = 'map';
    let progress = 0;
    let pathPoints = [];
    let checkpoints = [];
    let animationId = null;
    
    function resizeCanvas() {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight || 250;
      generatePaths();
    }
    
    function generatePaths() {
      pathPoints = [];
      checkpoints = [];
      const startX = 60;
      const startY = canvas.height / 2;
      const endX = canvas.width - 60;
      const endY = canvas.height / 2;
      
      if (currentMode === 'gps') {
        // Linear path
        const steps = 100;
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          pathPoints.push({
            x: startX + (endX - startX) * t,
            y: startY
          });
        }
      } else {
        // Wavy path representing steps of inquiry
        const steps = 150;
        const amplitude1 = canvas.height * 0.25;
        const amplitude2 = canvas.height * 0.1;
        
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = startX + (endX - startX) * t;
          
          // Generate a smooth winding path with sine/cosine waves
          const y = startY + 
                    Math.sin(t * Math.PI * 3) * amplitude1 + 
                    Math.cos(t * Math.PI * 6) * amplitude2;
          
          pathPoints.push({ x, y });
        }
        
        // Define checkpoints along the curve (at roughly t = 0.25, 0.55, 0.8)
        checkpoints.push({
          index: Math.floor(steps * 0.25),
          label: 'Sourcing Check',
          desc: 'Wrestling with origin & motive.'
        });
        checkpoints.push({
          index: Math.floor(steps * 0.55),
          label: 'disequilibrium',
          desc: 'Reconciling conflicting viewpoints.'
        });
        checkpoints.push({
          index: Math.floor(steps * 0.8),
          label: 'Synthesis',
          desc: 'Constructing independent meaning.'
        });
      }
    }
    
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const colorPrimary = isLight ? '#475569' : '#94a3b8';
      const colorBgLine = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
      
      const accent = currentMode === 'gps' ? 'hsl(350, 80%, 60%)' : 'hsl(210, 100%, 56%)';
      const activeLine = currentMode === 'gps' ? 'rgba(244, 63, 94, 0.4)' : 'rgba(59, 130, 246, 0.4)';
      
      const startX = 60;
      const startY = canvas.height / 2;
      const endX = canvas.width - 60;
      const endY = canvas.height / 2;
      
      // Draw static background line
      ctx.beginPath();
      if (currentMode === 'gps') {
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
      } else {
        ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
        for (let i = 1; i < pathPoints.length; i++) {
          ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
        }
      }
      ctx.strokeStyle = colorBgLine;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Draw checkpoints (Map Mode)
      if (currentMode === 'map') {
        checkpoints.forEach(cp => {
          const pt = pathPoints[cp.index];
          
          // Outer circle pulse
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 12, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
          ctx.fill();
          
          // Core node
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = 'hsl(38, 92%, 50%)';
          ctx.fill();
          
          // Text label
          ctx.fillStyle = colorPrimary;
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(cp.label.toUpperCase(), pt.x, pt.y - 18);
        });
      }
      
      // Draw Start & End points
      ctx.beginPath();
      ctx.arc(startX, startY, 8, 0, Math.PI * 2);
      ctx.fillStyle = colorPrimary;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(endX, endY, 8, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
      
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = colorPrimary;
      ctx.textAlign = 'center';
      ctx.fillText('INQUIRY START', startX, startY + 22);
      ctx.fillText('FINISHED PRODUCT', endX, endY + 22);
      
      // Animate path drawing progress
      const currentIndex = Math.floor(progress * (pathPoints.length - 1));
      if (currentIndex > 0) {
        ctx.beginPath();
        ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
        for (let i = 1; i <= currentIndex; i++) {
          ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
        }
        ctx.strokeStyle = activeLine;
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Draw moving dot
        const head = pathPoints[currentIndex];
        ctx.beginPath();
        ctx.arc(head.x, head.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.shadowBlur = 8;
        ctx.shadowColor = accent;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
        
        // Checkpoint tooltips in map mode
        if (currentMode === 'map') {
          checkpoints.forEach(cp => {
            if (currentIndex >= cp.index && currentIndex < cp.index + 12) {
              ctx.fillStyle = isLight ? '#0f172a' : '#ffffff';
              ctx.font = '10px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText(cp.desc, head.x, head.y + 18);
            }
          });
        }
      }
    }
    
    function animate() {
      // Fast for GPS, slow/reflective for Map
      const speed = currentMode === 'gps' ? 0.012 : 0.0035;
      progress += speed;
      if (progress > 1) {
        progress = 0;
      }
      draw();
      animationId = requestAnimationFrame(animate);
    }
    
    function toggleMode(mode) {
      currentMode = mode;
      progress = 0;
      generatePaths();
      
      // Update UI Toggles
      if (mode === 'gps') {
        gpsBtn.classList.add('active');
        mapBtn.classList.remove('active');
        
        simFriction.innerHTML = 'Zero <span style="color:var(--accent-rose); font-size:0.75rem;">(Bypass)</span>';
        simTime.textContent = 'Instantaneous (Chatbot generation)';
        simRetention.innerHTML = '0% <span style="color:var(--accent-rose); font-size:0.75rem;">(Null schema)</span>';
        simAgency.innerHTML = 'Passive Recipient';
        
        simFriction.style.color = 'var(--accent-rose)';
        simRetention.style.color = 'var(--accent-rose)';
        simAgency.style.color = 'var(--accent-rose)';
        
        simExplain.innerHTML = `<strong>The GPS Trap (Frictionless AI):</strong> The student enters a quick prompt and instantly receives a polished essay or presentation. Although the homework artifact is successfully created, the cognitive ZPD is bypassed, leaving no trace in the learner's long-term memory. This replicates the banking model against which Paulo Freire warned.`;
        simExplain.className = 'sim-explain risk';
      } else {
        gpsBtn.classList.remove('active');
        mapBtn.classList.add('active');
        
        simFriction.innerHTML = 'High <span style="color:var(--accent-emerald); font-size:0.75rem;">(Productive)</span>';
        simTime.textContent = 'Deliberate (Sustained wrestle)';
        simRetention.innerHTML = 'High <span style="color:var(--accent-emerald); font-size:0.75rem;">(Schema acquisition)</span>';
        simAgency.innerHTML = 'Active Inquiry Agent';
        
        simFriction.style.color = 'var(--accent-emerald)';
        simRetention.style.color = 'var(--accent-emerald)';
        simAgency.style.color = 'var(--accent-emerald)';
        
        simExplain.innerHTML = `<strong>The Map-Reading Journey (Pedagogical Friction):</strong> The learner is scaffolded through a series of checkpoints: sourcing documents, confronting conflicting narratives, and synthesizing arguments. Generative AI is used strictly as a critic or scaffold, not as a surrogate writer. The student remains in control, driving conceptual growth and agency.`;
        simExplain.className = 'sim-explain';
      }
    }
    
    gpsBtn.addEventListener('click', () => toggleMode('gps'));
    mapBtn.addEventListener('click', () => toggleMode('map'));
    
    window.addEventListener('resize', resizeCanvas);
    
    // Initial Setup
    resizeCanvas();
    toggleMode('map');
    animate();
  }

  // ==========================================================================
  // 3. Manuscript Reading Room TOC Tracker
  // ==========================================================================
  const readerSections = document.querySelectorAll('.manuscript-section');
  const tocItems = document.querySelectorAll('.reader-toc-item');
  
  if (readerSections.length > 0 && tocItems.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Trigger when section is in the middle of reading window
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          
          tocItems.forEach(item => {
            const link = item.querySelector('a');
            if (link && link.getAttribute('href') === `#${activeId}`) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);
    
    readerSections.forEach(section => {
      observer.observe(section);
    });
  }

  // ==========================================================================
  // 4. Dynamic Lesson Redesigner (Planner)
  // ==========================================================================
  const designerForm = document.getElementById('lesson-designer-form');
  const previewPlaceholder = document.getElementById('preview-placeholder');
  const previewOutput = document.getElementById('preview-output');
  const btnReset = document.getElementById('btn-reset-designer');
  
  if (designerForm) {
    designerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      generateRedesignedLesson();
    });
    
    btnReset.addEventListener('click', () => {
      designerForm.reset();
      previewOutput.style.display = 'none';
      previewPlaceholder.style.display = 'flex';
      window.scrollTo({
        top: document.getElementById('lesson-redesigner').offsetTop - 20,
        behavior: 'smooth'
      });
    });
  }
  
  // NCSS C3 Standards mapping database
  const standardsDB = {
    'historical-writing': {
      'Middle School (6-8)': [
        { code: 'D2.His.1.6-8', desc: 'Analyze connections among events and developments in broader historical contexts.' },
        { code: 'D2.His.16.6-8', desc: 'Organize applicable evidence into a coherent writing that supports a claim.' }
      ],
      'High School (9-10)': [
        { code: 'D2.His.1.9-12', desc: 'Evaluate how historical events and developments were shaped by unique circumstances of time and place.' },
        { code: 'D2.His.16.9-12', desc: 'Integrate evidence from multiple sources to support a claim, while acknowledging its limitations.' }
      ],
      'High School (11-12)': [
        { code: 'D2.His.5.9-12', desc: 'Analyze how historical contexts shaped and continue to shape people’s perspectives.' },
        { code: 'D2.His.16.9-12', desc: 'Integrate evidence from multiple sources to support a claim, while acknowledging its limitations and biases.' }
      ],
      'Higher Ed / AP': [
        { code: 'D2.His.14.9-12', desc: 'Analyze multiple and complex causes and effects of events in the past.' },
        { code: 'D2.His.16.9-12', desc: 'Integrate evidence from multiple sources to support a claim, while acknowledging its limitations and political/economic context.' }
      ]
    },
    'dbq': {
      'Middle School (6-8)': [
        { code: 'D2.His.11.6-8', desc: 'Use questions generated about multiple sources to identify pathways to further inquiry.' },
        { code: 'D2.His.12.6-8', desc: 'Compare the credibility and utility of multiple sources in relation to historical contexts.' }
      ],
      'High School (9-10)': [
        { code: 'D2.His.11.9-12', desc: 'Analyze multiple and complex causes and effects of events in the past.' },
        { code: 'D2.His.12.9-12', desc: 'Use questions generated about multiple sources to pursue further inquiry and investigate additional sources.' }
      ],
      'High School (11-12)': [
        { code: 'D2.His.11.9-12', desc: 'Analyze multiple and complex causes and effects of events in the past using a variety of sources.' },
        { code: 'D2.His.12.9-12', desc: 'Critically assess the source type, origin, purpose, and bias to pursue deeper historical analysis.' }
      ],
      'Higher Ed / AP': [
        { code: 'D2.His.12.9-12', desc: 'Evaluate the reliability and credibility of multiple primary/secondary sources to build historical consensus.' },
        { code: 'D2.His.16.9-12', desc: 'Integrate complex historical documentation into a synthesized written or verbal argument.' }
      ]
    },
    'current-events': {
      'Middle School (6-8)': [
        { code: 'D2.Civ.5.6-8', desc: 'Explain how citizens and institutions address social and political problems.' },
        { code: 'D2.Civ.10.6-8', desc: 'Explain how legislative and administrative policies address public problems.' }
      ],
      'High School (9-10)': [
        { code: 'D2.Civ.5.9-12', desc: 'Evaluate citizens and institutions effectiveness in addressing social and political problems.' },
        { code: 'D2.Civ.10.9-12', desc: 'Analyze the impact of political policies and media framing on addressing public problems.' }
      ],
      'High School (11-12)': [
        { code: 'D2.Civ.5.9-12', desc: 'Evaluate citizens and institutions effectiveness in addressing social and political problems at various levels.' },
        { code: 'D2.Civ.10.9-12', desc: 'Deconstruct how media framing and digital algorithms shape public perceptions of policy decisions.' }
      ],
      'Higher Ed / AP': [
        { code: 'D2.Civ.14.9-12', desc: 'Analyze contemporary and emerging means of changing societies, promoting the common good, and protecting rights.' },
        { code: 'D2.Civ.10.9-12', desc: 'Deconstruct institutional policy-making, media bias, and algorithmic sorting of public information.' }
      ]
    },
    'civic-debate': {
      'Middle School (6-8)': [
        { code: 'D2.Civ.2.6-8', desc: 'Explain how a democracy relies on citizens’ active and responsible participation.' },
        { code: 'D2.Civ.14.6-8', desc: 'Compare historical and contemporary means of changing societies and promoting the common good.' }
      ],
      'High School (9-10)': [
        { code: 'D2.Civ.2.9-12', desc: 'Analyze the role of citizens in the U.S. political system, and the balance between rights and responsibilities.' },
        { code: 'D2.Civ.14.9-12', desc: 'Analyze historical, contemporary, and emerging means of changing societies, promoting the common good, and protecting rights.' }
      ],
      'High School (11-12)': [
        { code: 'D2.Civ.2.9-12', desc: 'Critically analyze how systemic structures, laws, and citizen collective action influence public policy debates.' },
        { code: 'D2.Civ.14.9-12', desc: 'Design evidence-based proposals addressing contemporary societal debates and policy tensions.' }
      ],
      'Higher Ed / AP': [
        { code: 'D2.Civ.14.9-12', desc: 'Synthesize historical precedents and contemporary political theory to propose and debate policy solutions.' },
        { code: 'D2.Civ.10.9-12', desc: 'Analyze complex regulatory frameworks and constitutional tensions under active public debate.' }
      ]
    }
  };

  function cleanTopicName(task) {
    let cleaned = task;
    cleaned = cleaned.replace(/(essay|dbq|lesson|plan|assignment|project|activity|task|unit|module|syllabus)/gi, '');
    cleaned = cleaned.trim();
    cleaned = cleaned.replace(/\s+(of|for|on|about|in|with)$/i, '');
    return cleaned || task;
  }

  function generateEssentialQuestions(topic, category) {
    const t = cleanTopicName(topic);
    switch (category) {
      case 'historical-writing':
        return [
          `How do we construct a truthful historical narrative when the available sources present conflicting accounts of ${t}?`,
          `In what ways do standard historical summaries oversimplify the human struggles and diverse perspectives in ${t}?`,
          `How can we verify historical claims about ${t} to prevent misinformation from shaping our collective memory?`
        ];
      case 'dbq':
        return [
          `What primary evidence is most critical for understanding the underlying causes and human experiences of ${t}?`,
          `How does the origin, purpose, and context of a document affect its reliability for investigating ${t}?`,
          `How do we reconcile differing or contradictory primary perspectives when analyzing ${t}?`
        ];
      case 'current-events':
        return [
          `How do media platforms and algorithmic filters shape public understanding of ${t}?`,
          `What ethical issues, perspectives, or marginalized voices are omitted from mainstream accounts of ${t}?`,
          `How do contemporary policies regarding ${t} affect different socio-economic groups in society?`
        ];
      case 'civic-debate':
        return [
          `What are the core civic tensions (e.g., individual liberty vs. public good) at play in the debates surrounding ${t}?`,
          `How can citizens utilize evidence, dialogue, and institutional pathways to resolve controversies about ${t}?`,
          `What responsibilities do policy-makers and citizens bear when addressing the long-term impacts of ${t}?`
        ];
      default:
        return [
          `What are the core questions driving our inquiry into ${t}?`,
          `How do we analyze evidence and perspectives when studying ${t}?`,
          `What is the civic or ethical significance of our understanding of ${t}?`
        ];
    }
  }

  function generateRedesignedLesson() {
    // Collect values
    const originalTask = document.getElementById('original-task').value.trim() || 'Untitled Social Studies Task';
    const taskType = document.getElementById('task-type').value;
    const gradeLevel = document.getElementById('grade-level').value;
    const aiRole = document.getElementById('ai-role').value;
    
    const q1 = document.getElementById('q1-thinking').value.trim() || 'Unspecified cognitive target.';
    const q2 = document.getElementById('q2-barrier').value.trim() || 'Unspecified scaffolding target.';
    const q3 = document.getElementById('q3-human').value.trim() || 'Unspecified human agency target.';
    const q4 = document.getElementById('q4-ownership').value.trim() || 'Unspecified validation mechanism.';
    
    // Map Task Types labels
    const taskLabels = {
      'dbq': 'Document-Based Inquiry (DBQ)',
      'current-events': 'Current Events & Media Critique',
      'historical-writing': 'Historical Narrative/Argumentative Essay',
      'civic-debate': 'Civic Debate or Policy Simulation'
    };

    const cleanedTopic = cleanTopicName(originalTask);
    
    // Map AI Roles instructions dynamically
    const roleDetails = {
      'bias-audit': {
        name: 'Algorithmic Bias Auditor',
        strategy: 'Students audit AI-generated content to analyze exclusions, framing biases, and systemic perspectives.',
        promptText: `Prompt for the student: "Generate a summary of the causes and key events of ${cleanedTopic}. Write this from the perspective of standard school textbooks." Then, cross-reference this output with primary source texts representing marginalized or dissenting perspectives to audit omissions and framing bias.`,
        actionSteps: [
          `Request a standard introductory summary from the AI tool regarding ${cleanedTopic}.`,
          `Identify at least two key omissions, silences, or Eurocentric framing markers in the AI response.`,
          `Cross-reference the AI summary with provided primary source texts that represent alternative or marginalized perspectives.`,
          `Draft a revision proposal correcting the AI\'s bias, citing specific historical evidence.`
        ]
      },
      'devils-advocate': {
        name: 'Devil\'s Advocate Dialoguer',
        strategy: 'The AI acts as an opposing civic actor or critical historian, pushing students to strengthen their arguments.',
        promptText: `Prompt for the student: "Act as an expert historian or political analyst who strongly opposes the following claim: [student\'s thesis on ${cleanedTopic}]. Challenge my evidence and push me to defend my arguments point-by-point. Start by asking me for my first piece of evidence."`,
        actionSteps: [
          `Draft an initial thesis statement and a list of evidence about ${cleanedTopic} independently.`,
          `Input the custom prompt to configure the AI as an opposing perspective.`,
          `Conduct a 5-turn debate with the AI, documenting counter-arguments.`,
          `Revise the original thesis to account for the AI\'s objections, highlighting what changed.`
        ]
      },
      'document-critic': {
        name: 'Primary Document Corroborator',
        strategy: 'AI acts as a contextual source catalog, which the student must verify and research.',
        promptText: `Prompt for the student: "Act as a research assistant. Recommend three primary source quotes representing different social classes or actors during the events of ${cleanedTopic}. For each quote, name the author and context." Then, the student must verify if these quotes are real or hallucinated using archives.`,
        actionSteps: [
          `Request source suggestions and quotes from the AI tool regarding ${cleanedTopic}.`,
          `Verify each quote against physical or archival databases (e.g. Library of Congress, archives.gov).`,
          `Document any "hallucinations" or historical errors made by the AI model.`,
          `Annotate the verified quotes, explaining their reliability, bias, and context.`
        ]
      },
      'scaffold-tutor': {
        name: 'Inclusive Scaffold Tutor',
        strategy: 'AI assists in translating or chunking complex readings without explaining the arguments.',
        promptText: `Prompt for the student: "Here is a primary source text about ${cleanedTopic}: [paste text]. Translate this into modern vernacular and a simplified reading level, but do NOT explain the historical argument. Provide a glossary of three difficult words."`,
        actionSteps: [
          `Select a complex primary source text regarding ${cleanedTopic} that represents a reading barrier.`,
          `Use the AI to translate or simplify the text while preserving the conceptual inquiry.`,
          `Identify key arguments and vocabulary within the simplified output.`,
          `Formulate an independent thesis statement answering the core lesson question.`
        ]
      }
    };
    
    const activeRole = roleDetails[aiRole];

    // Generate EQs, objectives, and standards
    const eqs = generateEssentialQuestions(originalTask, taskType);
    const objectives = [
      `Students will be able to analyze <strong>${q1}</strong> in relation to the study of <strong>${cleanedTopic}</strong>.`,
      `Students will be able to utilize generative AI as a <strong>${activeRole.name}</strong> to support <strong>${q2}</strong> without ceding their own voice.`,
      `Students will be able to evaluate and synthesize arguments regarding <strong>${cleanedTopic}</strong>, preserving human judgment over <strong>${q3}</strong> and demonstrating ownership via <strong>${q4}</strong>.`
    ];

    // Get C3 standards
    const c3Standards = (standardsDB[taskType] && standardsDB[taskType][gradeLevel]) || [
      { code: 'D2.Civ.2.9-12', desc: 'Analyze the role of citizens in the political system, and the balance between rights and responsibilities.' },
      { code: 'D2.His.16.9-12', desc: 'Integrate evidence from multiple sources to support a claim, while acknowledging its limitations.' }
    ];
    
    // Construct HTML output card
    const htmlOutput = `
      <div class="glass-card lesson-output-card" id="redesigned-card-printable">
        <div class="output-header">
          <div class="output-title-block">
            <span class="output-meta">Redesigned Social Studies Lesson Plan</span>
            <h3>${originalTask}</h3>
            <span class="output-meta">${taskLabels[taskType]} | Grade: ${gradeLevel}</span>
          </div>
          <span class="output-badge">${activeRole.name} Mode</span>
        </div>
        
        <!-- Tab Navigation (Hidden in print) -->
        <div class="output-tabs no-print">
          <button class="output-tab active" data-target="tab-overview">Overview &amp; Standards</button>
          <button class="output-tab" data-target="tab-steps">Instructional Steps</button>
          <button class="output-tab" data-target="tab-assessment">Assessment &amp; Rubric</button>
        </div>
        
        <!-- SECTION 1: OVERVIEW & STANDARDS -->
        <div class="tab-content active" id="tab-overview">
          <div class="output-section">
            <h4><span style="color:var(--accent-gold);">⚡</span> Pedagogical Stance</h4>
            <p><strong>Primary AI Strategy:</strong> ${activeRole.strategy}</p>
          </div>
          
          <div class="output-section">
            <h4><span style="color:var(--accent-gold);">❓</span> Essential Questions (EQs)</h4>
            <ul style="margin-left: 1.25rem; font-size: 0.88rem; color: var(--text-secondary); display: grid; gap: 0.35rem;">
              ${eqs.map(eq => `<li>${eq}</li>`).join('')}
            </ul>
          </div>
          
          <div class="output-section">
            <h4><span style="color:var(--accent-emerald);">🎯</span> Learning Objectives (SWBAT)</h4>
            <ol style="margin-left: 1.25rem; font-size: 0.88rem; color: var(--text-secondary); display: grid; gap: 0.35rem;">
              ${objectives.map(obj => `<li>${obj}</li>`).join('')}
            </ol>
          </div>
          
          <div class="output-section">
            <h4><span style="color:var(--accent-blue);">⚖️</span> NCSS C3 Standards Alignment</h4>
            <div style="display: grid; gap: 0.5rem;">
              ${c3Standards.map(std => `
                <div style="font-size: 0.85rem; border-left: 2px solid var(--accent-blue); padding-left: 0.75rem; color: var(--text-secondary);">
                  <strong style="color: var(--text-primary);">${std.code}:</strong> ${std.desc}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <!-- SECTION 2: INSTRUCTIONAL STEPS -->
        <div class="tab-content" id="tab-steps">
          <div class="output-grid-2">
            <div class="output-section">
              <h4><span style="color:var(--accent-blue);">🤖</span> AI Support (Scaffolding Focus)</h4>
              <p><strong>Responsibility:</strong> ${q2}</p>
            </div>
            <div class="output-section">
              <h4><span style="color:var(--accent-blue);">👤</span> Human Cognition Kept (Noetic Focus)</h4>
              <p><strong>Struggle:</strong> ${q3}</p>
            </div>
          </div>
          
          <div class="output-section">
            <h4><span style="color:var(--accent-blue);">📋</span> Target Thinking &amp; Skills</h4>
            <p>${q1}</p>
          </div>
          
          <div class="output-section">
            <h4><span style="color:var(--accent-gold);">💬</span> Recommended AI Prompt for Students</h4>
            <div class="sim-explain" style="font-family: monospace; font-size: 0.8rem; line-height: 1.4; border-left-color: var(--accent-gold); margin-bottom: 0;">
              ${activeRole.promptText}
            </div>
          </div>
          
          <div class="output-section">
            <h4><span style="color:var(--accent-emerald);">👣</span> Step-by-Step Lesson Workflow (60 Mins)</h4>
            <div class="lesson-timeline" style="display: grid; gap: 1rem; font-size: 0.88rem;">
              <div class="timeline-item" style="border-left: 2px solid var(--surface-border-hover); padding-left: 1rem;">
                <strong>Phase 1: Hook &amp; Disequilibrium Launch (10 mins)</strong>
                <p style="margin: 0.25rem 0 0; color: var(--text-muted);">Teacher poses high-friction historical questions or conflicting quotes. Students perform a quick write on initial assumptions to expose gaps in their prior schemas.</p>
              </div>
              <div class="timeline-item" style="border-left: 2px solid var(--accent-gold); padding-left: 1rem;">
                <strong>Phase 2: AI Dialogic Scaffolding (15 mins)</strong>
                <p style="margin: 0.25rem 0 0; color: var(--text-muted);">Students execute the customized student prompt above, engaging the AI as a <em>${activeRole.name}</em> to reduce the barrier of <em>${q2}</em>. They document AI responses but do not copy text.</p>
              </div>
              <div class="timeline-item" style="border-left: 2px solid var(--accent-blue); padding-left: 1rem;">
                <strong>Phase 3: The Human Struggle - Cognitive Synthesis (25 mins)</strong>
                <p style="margin: 0.25rem 0 0; color: var(--text-muted);">Students work independently or in pairs, comparing AI output with primary source archives. They tackle the core human task: <em>${q3}</em>, constructing their own final thesis and defense.</p>
              </div>
              <div class="timeline-item" style="border-left: 2px solid var(--accent-emerald); padding-left: 1rem;">
                <strong>Phase 4: Verification &amp; Metacognitive Debrief (10 mins)</strong>
                <p style="margin: 0.25rem 0 0; color: var(--text-muted);">Students implement the verification mechanism: <em>${q4}</em>. The class reflects together: "How did AI support us, and where did it try to bypass our own thinking?"</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- SECTION 3: ASSESSMENT & RUBRIC -->
        <div class="tab-content" id="tab-assessment">
          <div class="output-section">
            <h4><span style="color:var(--accent-emerald);">✍️</span> Demonstration of Student Ownership</h4>
            <p><strong>Verification &amp; Accountability Mechanism:</strong> ${q4}</p>
          </div>
          
          <div class="output-section">
            <h4><span style="color:var(--accent-gold);">📊</span> Constructivist Verification Rubric</h4>
            <div style="overflow-x: auto; margin-top: 0.5rem;">
              <table class="rubric-table" style="width:100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
                <thead>
                  <tr style="border-bottom: 2px solid var(--surface-border-hover);">
                    <th style="padding: 0.5rem; font-weight: 700; width: 25%;">Criteria</th>
                    <th style="padding: 0.5rem; font-weight: 700; color: var(--accent-emerald);">Distinguished (3)</th>
                    <th style="padding: 0.5rem; font-weight: 700; color: var(--accent-blue);">Proficient (2)</th>
                    <th style="padding: 0.5rem; font-weight: 700; color: var(--accent-rose);">Emerging (1)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid var(--surface-border);">
                    <td style="padding: 0.5rem; font-weight: 600;">Cognitive Independence</td>
                    <td style="padding: 0.5rem; color: var(--text-muted);">Student voice is completely original; AI is used strictly as a scaffold to support <em>${q2}</em>. Thesis is unique and self-directed.</td>
                    <td style="padding: 0.5rem; color: var(--text-muted);">Student voice is clear, though some ideas replicate standard AI summaries. Core arguments are defended independently.</td>
                    <td style="padding: 0.5rem; color: var(--text-muted);">Work largely replicates AI outputs with minimal independent voice or original synthesis.</td>
                  </tr>
                  <tr style="border-bottom: 1px solid var(--surface-border);">
                    <td style="padding: 0.5rem; font-weight: 600;">Empirical Rigor &amp; Verification</td>
                    <td style="padding: 0.5rem; color: var(--text-muted);">Student systematically verifies AI claims against primary sources, actively identifying omissions and limitations.</td>
                    <td style="padding: 0.5rem; color: var(--text-muted);">Student checks major claims but accepts general AI narratives without deep archival cross-referencing.</td>
                    <td style="padding: 0.5rem; color: var(--text-muted);">Student accepts AI outputs as historical truth without external verification.</td>
                  </tr>
                  <tr style="border-bottom: 1px solid var(--surface-border);">
                    <td style="padding: 0.5rem; font-weight: 600;">Metacognitive Documentation</td>
                    <td style="padding: 0.5rem; color: var(--text-muted);">Student provides a detailed prompt log and reflects deeply on how they navigated productive struggle.</td>
                    <td style="padding: 0.5rem; color: var(--text-muted);">Student provides list of prompts used with minimal reflection on the collaboration.</td>
                    <td style="padding: 0.5rem; color: var(--text-muted);">Prompt log is missing or shows only a single prompt with no iteration.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div class="output-actions">
          <button class="btn btn-primary" onclick="window.print()" style="padding: 0.6rem 1.2rem; font-size: 0.85rem;">
            <span>🖨️</span> Print Lesson Plan
          </button>
          <button class="btn btn-secondary" id="btn-copy-plan" style="padding: 0.6rem 1.2rem; font-size: 0.85rem;">
            <span>📋</span> Copy to Clipboard
          </button>
        </div>
      </div>
    `;
    
    // Switch preview visibility
    previewPlaceholder.style.display = 'none';
    previewOutput.innerHTML = htmlOutput;
    previewOutput.style.display = 'block';
    
    // Bind Tab switching listeners
    const tabs = previewOutput.querySelectorAll('.output-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const target = tab.getAttribute('data-target');
        const contents = previewOutput.querySelectorAll('.tab-content');
        contents.forEach(c => {
          if (c.id === target) {
            c.classList.add('active');
          } else {
            c.classList.remove('active');
          }
        });
      });
    });

    // Bind Copy Button
    const copyBtn = document.getElementById('btn-copy-plan');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        copyLessonToClipboard(originalTask, taskLabels[taskType], gradeLevel, activeRole, q1, q2, q3, q4, eqs, objectives, c3Standards);
      });
    }
    
    // Scroll smoothly to output on mobile
    if (window.innerWidth <= 1024) {
      previewOutput.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  function copyLessonToClipboard(title, type, grade, role, q1, q2, q3, q4, eqs, objectives, c3Standards) {
    const textToCopy = `
=== CONSTRUCTIVIST SOCIAL STUDIES LESSON BLUEPRINT ===
Title: ${title}
Task Category: ${type}
Grade Level: ${grade}
AI Pedagogical Role: ${role.name}
Pedagogical Strategy: ${role.strategy}

--------------------------------------------------
1. ESSENTIAL QUESTIONS (EQs)
${eqs.map(eq => `   * ${eq}`).join('\n')}

2. LEARNING OBJECTIVES (SWBAT)
${objectives.map((obj, i) => `   ${i+1}. ${obj.replace(/<\/?strong>/g, '')}`).join('\n')}

3. NCSS C3 STANDARDS ALIGNMENT
${c3Standards.map(std => `   * ${std.code}: ${std.desc}`).join('\n')}

--------------------------------------------------
4. PEDAGOGICAL SCAFFOLDING BALANCE
   * Target Thinking & Skills: ${q1}
   * Responsible AI Scaffolding (Reduce Barrier): ${q2}
   * Retained Human Cognition (Active Struggle): ${q3}

5. RECOMMENDED AI SYSTEM PROMPT
   ${role.promptText}

--------------------------------------------------
6. TIMED INSTRUCTIONAL SEQUENCE (60 MINUTES)
   * Phase 1: Hook & Disequilibrium Launch (10 mins)
     Teacher poses high-friction historical questions or conflicting quotes. Students perform a quick write on initial assumptions to expose gaps in their prior schemas.
   
   * Phase 2: AI Dialogic Scaffolding (15 mins)
     Students execute the customized student prompt above, engaging the AI as a ${role.name} to reduce the barrier of: ${q2}. They document AI responses but do not copy text.
   
   * Phase 3: The Human Struggle - Cognitive Synthesis (25 mins)
     Students work independently or in pairs, comparing AI output with primary source archives. They tackle the core human task: ${q3}, constructing their own final thesis and defense.
   
   * Phase 4: Verification & Metacognitive Debrief (10 mins)
     Students implement the verification mechanism: ${q4}. The class reflects together: "How did AI support us, and where did it try to bypass our own thinking?"

--------------------------------------------------
7. ASSESSMENT & STUDENT VERIFICATION
   * Verification & Accountability Mechanism: ${q4}
   * Rubric Criteria:
     - Cognitive Independence:
       [Distinguished] Student voice is completely original; AI is used strictly as a scaffold to support ${q2}. Thesis is unique and self-directed.
       [Proficient] Student voice is clear, though some ideas replicate standard AI summaries. Core arguments are defended independently.
       [Emerging] Work largely replicates AI outputs with minimal independent voice or original synthesis.
     - Empirical Rigor & Verification:
       [Distinguished] Student systematically verifies AI claims against primary sources, actively identifying omissions and limitations.
       [Proficient] Student checks major claims but accepts general AI narratives without deep archival cross-referencing.
       [Emerging] Student accepts AI outputs as historical truth without external verification.
     - Metacognitive Documentation:
       [Distinguished] Student provides a detailed prompt log and reflects deeply on how they navigated productive struggle.
       [Proficient] Student provides list of prompts used with minimal reflection on the collaboration.
       [Emerging] Prompt log is missing or shows only a single prompt with no iteration.
==================================================
    `;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      const copyBtn = document.getElementById('btn-copy-plan');
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span>✅</span> Blueprint Copied!';
      copyBtn.style.background = 'var(--accent-emerald)';
      copyBtn.style.color = 'white';
      
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = 'transparent';
        copyBtn.style.color = 'var(--text-primary)';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }
});
