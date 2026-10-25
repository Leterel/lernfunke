import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LESSON,localDay,validDay,previousDay,summary,parseBackup,validateEvents} from '../model.js';
import {lessons,lessonIds} from '../curriculum.js';
const event=day=>({id:`${LESSON}:${day}`,lesson:LESSON,day});
test('calendar dates and DST-independent previous day',()=>{
 assert.equal(validDay('2024-02-29'),true);for(const value of ['2026-02-29','2026-04-31','2026-1-01',null,'garbage'])assert.equal(validDay(value),false);
 assert.equal(previousDay('2026-03-30'),'2026-03-29');assert.equal(previousDay('2026-10-26'),'2026-10-25');assert.equal(previousDay('2024-03-01'),'2024-02-29');
 assert.equal(localDay(new Date(2026,0,2,23,59)),'2026-01-02');
});
test('same-day duplicates never inflate streak or day totals',()=>{
 const state=summary([event('2026-10-19'),event('2026-10-19'),event('2026-10-20')],'2026-10-20');
 assert.equal(state.days,2);assert.equal(state.current,2);assert.equal(state.events.length,2);
});
test('yesterday preserves streak, a missed day expires it, longest remains',()=>{
 const events=['2026-10-17','2026-10-18','2026-10-19'].map(event);
 assert.equal(summary(events,'2026-10-20').current,3);assert.equal(summary(events,'2026-10-21').current,0);assert.equal(summary(events,'2026-10-21').longest,3);
 assert.equal(summary([...events,event('2026-10-21')],'2026-10-21').current,1);
});
test('future days do not extend the current streak',()=>{
 assert.equal(summary([event('2026-10-20'),event('2026-10-21')],'2026-10-20').current,1);
});
test('backup normalizes immutable keys and rejects malformed payloads atomically',()=>{
 const encode=events=>JSON.stringify({format:'lernfunke-progress',version:1,events});
 assert.equal(parseBackup(encode([event('2026-10-20'),event('2026-10-20')])).length,1);
 for(const text of ['{}','bad',encode([{...event('2026-10-20'),id:'wrong'}]),encode([event('2026-10-20'),event('2026-02-30')]),' '.repeat(2_000_001)])assert.throws(()=>parseBackup(text));
 assert.throws(()=>validateEvents(Array(20001).fill(event('2026-10-20'))));
});

test('eight lessons on the same day advance course progress but count one streak day',()=>{
 const events=lessonIds.map(lesson=>({id:`${lesson}:2026-10-22`,lesson,day:'2026-10-22'}));
 const state=summary([...events,events[2]],'2026-10-22');
 assert.equal(state.completedLessons,lessonIds.length);assert.equal(state.days,1);assert.equal(state.current,1);assert.equal(state.events.length,lessonIds.length);
 for(const id of lessonIds)assert.deepEqual(state.perLesson[id],{complete:true,today:true,days:1});
 assert.equal(summary(events.slice(0,1),'2026-10-22').perLesson[lessonIds[1]].complete,false);
});

test('v1 imports retain original event identity and v2 retains all lesson completions',()=>{
 const original=event('2026-10-20');
 assert.deepEqual(parseBackup(JSON.stringify({format:'lernfunke-progress',version:1,events:[original]})),[original]);
 const newer={id:`${lessonIds[1]}:2026-10-22`,lesson:lessonIds[1],day:'2026-10-22'};
 assert.equal(parseBackup(JSON.stringify({format:'lernfunke-progress',version:2,events:[original,newer]})).length,2);
 assert.throws(()=>parseBackup(JSON.stringify({format:'lernfunke-progress',version:1,events:[original,newer]})));
 assert.throws(()=>validateEvents([{id:'constructor:2026-10-22',lesson:'constructor',day:'2026-10-22'}]));
});

test('authored lesson fixtures cover boundary cases and each starter needs a correction',()=>{
 assert.equal(new Set(lessonIds).size,8);
 for(const lesson of lessons){
  assert.equal(lesson.cases.length,4);assert.match(lesson.parameter,/^[a-z]+$/);
  const starter=new Function(lesson.parameter,lesson.starter);
  assert.ok(lesson.cases.some(([input,expected])=>!Object.is(starter(input),expected)),lesson.id);
 }
 assert.deepEqual(lessons[2].cases.find(([input])=>input===50),[50,0]);
 assert.deepEqual(lessons[3].cases.find(([input])=>input===0),[0,0]);
});


test('original four v2 completions stay valid and newly authored lessons use structured fixtures',()=>{
 const events=lessonIds.slice(0,4).map(lesson=>({id:lesson+':2026-10-22',lesson,day:'2026-10-22'}));
 const restored=parseBackup(JSON.stringify({format:'lernfunke-progress',version:2,events}));
 assert.equal(restored.length,4);assert.equal(summary(restored,'2026-10-25').completedLessons,4);
 assert.equal(summary(restored,'2026-10-25').perLesson['js-arrays-1'].complete,false);
 assert.deepEqual(lessons[4].cases[0],[[],0]);assert.deepEqual(lessons[5].cases[2],['   ','']);
 assert.deepEqual(lessons[7].cases[2],[[{preis:25,anzahl:2}],50]);
});
