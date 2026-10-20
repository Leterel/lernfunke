import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LESSON,localDay,validDay,previousDay,summary,parseBackup,validateEvents} from '../model.js';
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
