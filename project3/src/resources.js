const states =   ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
const biasmotivation = ['Anti-Asian','Anti-Black or African American','Anti-Female Homosexual (Lesbian)','Anti-Hispanic or Latino','Anti-Jewish','Anti-Male Homosexual (Gay)','Anti-White','Anti-Lesbian, Gay, Bisexual, or Transgender, Mixed Group (LGBT)','Anti-Not Hispanic or Latino','Anti-Other Religion','Anti-Islamic (Muslem)','Anti-Multi-Racial Group','Anti-Protestant','Anti-Multi-Religious Group','Anti-Arab','Anti-Catholic','Anti-American Indian or Alaska Native','Anti-Bisexual','Anti-Mental Disability','Anti-Physical Disability','Anti-Heterosexual','Anti-Atheist/Agnosticism','Anti-Female','Anti-Transgender']
function getStates(){
    return states;
}
function getBias(){
    return biasmotivation;
}
export {getStates,getBias}
