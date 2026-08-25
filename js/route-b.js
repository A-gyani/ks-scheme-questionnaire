/*
 * route-b.js — decides which Part B questions a given scheme still needs.
 *
 * 58 questions per scheme, across 148 applicant-facing schemes, is a great deal
 * of officer time. This file sets aside the questions a scheme genuinely cannot
 * answer, so nobody is asked about a committee that does not exist or an
 * application process that nobody goes through.
 *
 * ⭐ THE RULE THAT GOVERNS THIS FILE — BIAS TOWARDS ASKING.
 * Wrongly setting a question aside is invisible: the fact is never captured and
 * nobody ever learns it was missed. Wrongly asking one costs the officer three
 * seconds to skip. The two mistakes are not equally bad, so every rule here
 * defaults to SHOWING the question, and only sets it aside on a clear positive
 * answer. An unanswered driver question therefore sets nothing aside.
 *
 * ⭐ ONLY RULES THE INSTRUMENT ITSELF STATES.
 * Five of the six rules are written in plain words in `Scheme Questionnaire.md`
 * ("Skip if only individuals apply", "Only if a committee exists", "Answer only
 * if this scheme is run at district level"). They are transcribed, not invented.
 * The sixth — no applicant, therefore no application process — is the one
 * inference, and it is deliberately narrow: it fires only when EVERY ticked
 * mechanism is one where the office runs its own event.
 *
 * Anything beyond these six needs the department's sign-off before it goes in.
 * A rule added here silently removes a question from 148 questionnaires.
 *
 * The on-screen reasons used to end with "(The instrument says: …)" — us
 * proving to the officer that we had not invented the rule. That is a note to
 * ourselves; it is recorded here instead, and the officer gets the reason.
 *
 * NOT ROUTED, ON PURPOSE:
 *   B5.2 — "culture / performing-arts schemes only; skip for youth, sports,
 *          yoga or adventure". That depends on the art form, which the app does
 *          not hold anywhere. It keeps its own written skip note and stays up.
 *   B9   — an award scheme needs no bills, but B9.1 and B9.2 already carry
 *          "No — paid without any further documents (e.g. award / pension)" and
 *          "Not applicable (award / pension)" as ANSWERS. Setting the block
 *          aside would throw away the very fact we want recorded.
 *
 * Nothing here ever deletes an answer. A question that becomes set aside keeps
 * whatever was typed into it; it is hidden from view, not erased.
 */
window.RouteB = (function () {
  'use strict';

  /* An answer may be an array (tick-list) or a string (choose-one). */
  function list(v) { return Array.isArray(v) ? v : (v ? [v] : []); }

  /*
   * The six rules. `test` returns true when the question should be SET ASIDE.
   * `source` is the question whose answer decided it — shown to the officer so
   * the fold never looks arbitrary, and used to know when to re-evaluate.
   */
  var RULES = [
    {
      id: 'noApplicant',
      section: 'B4',
      questions: ['B4.1', 'B4.2', 'B4.3', 'B4.4', 'B4.6'],
      source: 'B0.5',
      watch: 'B0.5.mechanism',
      reasonEN: 'Set aside: this scheme has no applicant. B0.5 says the office runs the '
              + 'event and chooses the artists itself, so there is no application to make.',
      reasonGU: 'બાજુ પર: આ યોજનામાં અરજદાર નથી. B0.5 મુજબ કચેરી પોતે કાર્યક્રમ યોજે છે અને '
              + 'કલાકારો પસંદ કરે છે, તેથી અરજી કરવાની પ્રક્રિયા જ નથી.',
      test: function (a) {
        var m = list(a['B0.5.mechanism']);
        if (!m.length) return false;             /* unanswered → ask everything */
        /* Only these two mechanisms have nobody applying. Any other tick —
           including "combination" or "other" — means applications exist. */
        return m.every(function (x) { return x === 'engaged' || x === 'provided'; });
      }
    },
    {
      id: 'individualOnlyReg',
      questions: ['B2.6'],
      source: 'B2.1',
      watch: 'B2.1.whoApplies',
      reasonEN: 'Set aside: B2.1 says only individuals apply, so there is no group or '
              + 'institution registration to check.',
      reasonGU: 'બાજુ પર: B2.1 મુજબ ફક્ત વ્યક્તિ અરજી કરે છે, તેથી જૂથ કે સંસ્થાની નોંધણી '
              + 'તપાસવાની રહેતી નથી.',
      test: onlyIndividuals
    },
    {
      id: 'individualOnlyRoster',
      questions: ['B5.3'],
      source: 'B2.1',
      watch: 'B2.1.whoApplies',
      reasonEN: 'Set aside: B2.1 says only individuals apply, so there is no group member '
              + 'roster.',
      reasonGU: 'બાજુ પર: B2.1 મુજબ ફક્ત વ્યક્તિ અરજી કરે છે, તેથી જૂથની સભ્ય યાદી નથી.',
      test: onlyIndividuals
    },
    {
      id: 'noCommittee',
      questions: ['B7.5'],
      source: 'B7.4',
      watch: 'B7.4.involvement',
      reasonEN: 'Set aside: B7.4 says an officer decides, with no committee.',
      reasonGU: 'બાજુ પર: B7.4 મુજબ અધિકારી નક્કી કરે છે, સમિતિ નથી.',
      test: function (a) { return a['B7.4.involvement'] === 'none'; }
    },
    {
      id: 'notDistrictShare',
      questions: ['B10.2'],
      source: 'B10.1',
      watch: 'B10.1.decidedWhere',
      reasonEN: 'Set aside: B10.1 says the scheme runs entirely at the State office, so '
              + 'there is no district share to fix.',
      reasonGU: 'બાજુ પર: B10.1 મુજબ યોજના સંપૂર્ણ રાજ્ય કચેરીએ ચાલે છે, તેથી જિલ્લાનો ભાગ '
              + 'નક્કી કરવાનો રહેતો નથી.',
      test: notDistrictRun
    },
    {
      id: 'notDistrictReport',
      questions: ['B10.3'],
      source: 'B10.1',
      watch: 'B10.1.decidedWhere',
      reasonEN: 'Set aside: B10.1 says the scheme runs entirely at the State office, so no '
              + 'district sends anything back.',
      reasonGU: 'બાજુ પર: B10.1 મુજબ યોજના સંપૂર્ણ રાજ્ય કચેરીએ ચાલે છે, તેથી કોઈ જિલ્લો કંઈ '
              + 'પરત મોકલતો નથી.',
      test: notDistrictRun
    }
  ];

  /*
   * "Individual-only" is read strictly: the one and only ticked type is
   * "individual". A scheme that also admits institutions, government bodies or
   * an unnamed "other" keeps both questions, because we cannot be sure.
   */
  function onlyIndividuals(a) {
    var w = list(a['B2.1.whoApplies']);
    return w.length === 1 && w[0] === 'individual';
  }

  /* "Mixed" and "don't know" both keep the district questions up — only a
     positive "entirely at the State office" sets them aside. */
  function notDistrictRun(a) {
    return a['B10.1.decidedWhere'] === 'state';
  }

  /* The answer keys that can change what is asked. A commit to any other key
     changes nothing about the shape of the form. */
  var WATCHED = RULES.map(function (r) { return r.watch; })
                     .filter(function (k, i, all) { return all.indexOf(k) === i; });

  function affectsRouting(key) { return WATCHED.indexOf(key) !== -1; }

  /*
   * The officer may also set a whole section aside themselves — their judgement
   * about their own scheme beats our rules. B0 is excluded: it carries the
   * scheme's identity and B0.5, the answer every rule reads. B11 is excluded
   * because an officer's own view of a scheme always applies.
   */
  function canMarkNA(sectionId) { return sectionId !== 'B0' && sectionId !== 'B11'; }

  var OFFICER_REASON_EN = 'Set aside: you marked this section as not applying to this scheme.';
  var OFFICER_REASON_GU = 'બાજુ પર: આ વિભાગ આ યોજનાને લાગુ પડતો નથી એમ આપે નોંધ્યું છે.';

  /*
   * spec     — window.SPEC_B
   * answers  — { key: value } as currently on screen
   * na       — { sectionId: true } sections the officer set aside by hand
   * opened   — { sectionId|questionId: true } folds the officer chose to open
   *
   * Returns everything the screen needs, and never mutates its arguments.
   */
  function evaluate(spec, answers, na, opened) {
    answers = answers || {}; na = na || {}; opened = opened || {};

    var aside = {};   /* questionId -> {reasonEN, reasonGU, source, byOfficer} */

    RULES.forEach(function (r) {
      if (!r.test(answers)) return;
      r.questions.forEach(function (qid) {
        aside[qid] = { reasonEN: r.reasonEN, reasonGU: r.reasonGU,
                       source: r.source, ruleId: r.id, byOfficer: false };
      });
    });

    /* An officer's own mark covers the whole section and overrides the reason,
       so the fold explains itself in their terms rather than ours. */
    spec.questions.forEach(function (q) {
      if (na[q.section] && canMarkNA(q.section)) {
        aside[q.id] = { reasonEN: OFFICER_REASON_EN, reasonGU: OFFICER_REASON_GU,
                        source: null, ruleId: 'officer', byOfficer: true };
      }
    });

    /* A section counts as wholly set aside only when every one of its questions
       is — otherwise the section stays open and folds its questions one by one. */
    var bySection = {}, sections = {};
    spec.questions.forEach(function (q) {
      (bySection[q.section] = bySection[q.section] || []).push(q);
    });
    Object.keys(bySection).forEach(function (sid) {
      var all = bySection[sid];
      if (all.every(function (q) { return aside[q.id]; })) {
        sections[sid] = aside[all[0].id];
      }
    });

    /*
     * A fold the officer has opened is drawn and counted like any other
     * question. Opening a whole section opens every question inside it.
     */
    function isOpened(q) { return !!(opened[q.id] || opened[q.section]); }

    var shown = spec.questions.filter(function (q) { return !aside[q.id] || isOpened(q); });

    return {
      aside: aside,
      sections: sections,
      shown: shown,
      isAside: function (q) { return !!aside[q.id] && !isOpened(q); },
      reasonFor: function (q) { return aside[q.id] || null; },
      counts: {
        total: spec.questions.length,
        shown: shown.length,
        setAside: spec.questions.length - shown.length
      }
    };
  }

  /*
   * How many answers already sit inside a fold. Shown on the folded card so a
   * section that already holds work never closes silently over it.
   */
  function answersInside(questions, answers) {
    var n = 0;
    questions.forEach(function (q) {
      var prefix = q.id + '.';
      Object.keys(answers || {}).forEach(function (k) {
        if (k.indexOf(prefix) !== 0) return;
        var v = answers[k];
        if (Array.isArray(v) ? v.length : String(v == null ? '' : v).trim() !== '') n++;
      });
    });
    return n;
  }

  return {
    evaluate: evaluate,
    affectsRouting: affectsRouting,
    canMarkNA: canMarkNA,
    answersInside: answersInside,
    RULES: RULES,
    WATCHED: WATCHED
  };
})();
