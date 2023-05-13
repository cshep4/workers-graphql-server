module.exports = `
    type AuthResponse {
        id: String!
        jwt: String!
    }
    
    input RegisterInput {
        firstName: String!
        surname: String!
        email: String!
        password: String!
        confirmPassword: String!
        predictedWinner: String!
    }
    
    input PasswordResetInput {
        email: String!
        signature: String!
        password: String!
        passwordConfirmation: String!
    }
    
    type TeamMatchResult {
        result: String!
        score: String!
        opponent: String!
        location: String!
    }
    
    type TeamForm {
        team: String!
        forms: [TeamMatchResult!]!
    }
    
    enum Stage {
        GROUP_A
        GROUP_B
        GROUP_C
        GROUP_D
        GROUP_E
        GROUP_F
        GROUP_G
        GROUP_H
        ROUND_OF_16
        QUARTER_FINAL
        SEMI_FINAL
        THIRD_PLACE_PLAY_OFF
        FINAL
    }
    
    type Fixture {
        id: String!
        userId: String!
        hTeam: String!
        aTeam: String!
        hGoals: Int
        aGoals: Int
        played: Int!
        kickOffTimeUtc: DateTime!
        stage: Stage!
    }

    type LeagueUser {
        id: String!
        firstName: String!
        surname: String!
        predictedWinner: String!
        rank: Float!
        score: Int!
    }
    
    type League {
        pin: String!
        name: String!
        users: [LeagueUser!]!
    }
    
    type LeagueDetails {
        leagueName: String!
        pin: String!
        rank: Float!
    }
    
    type LeagueOverview {
        rank: Float
        score: Int!
        userCount: Int!
        leagues: [LeagueDetails!]
    }

    type UpcomingMatchday {
        date: String!
        matches: [LiveMatch!]!
    }
    
    enum Status {
        PRE_GAME
        FIRST_HALF
        SECOND_HALF
        EXTRA_TIME
        PENALTIES
        HALF_TIME
        FULL_TIME
    }
    
    type LiveMatch {
        id: String!
        stage: Stage!
        venue: Venue
        status: Status!
        timer: String! # minute of match, could be like 37' or like 45+3' if in added time
        homeTeamId: String!
        homeTeamName: String!
        homeTeamScore: Int
        awayTeamId: String!
        awayTeamName: String!
        awayTeamScore: Int
        htScore: String
        ftScore: String
        etScore: String
        penaltyHome: Int
        penaltyAway: Int
        events: [Event!]!
        liveStats: LiveStats
        kickOffTimeUtc: DateTime!
    }
    
    type Venue {
        name: String!
        city: String!
        country: String!
        latitude: Float
        longitude: Float
    }
    
    enum EventType {
        YELLOW_CARD
        RED_CARD
        SUBSTITUTION
        GOAL
        PENALTY_MISS
    }
    
    enum Team {
        HOME
        AWAY
    }
    
    type Event {
        id: String!
        type: EventType!
        minute: Int!
        extraMin: Int
        team: Team!
        player: String!
        playerId: String!
        assist: String
        assistId: String
    }
    
    type LiveStats {
        matchInfo: MatchInfo
        homeLineup: Lineup
        awayLineup: Lineup
        substitutions: Substitutions
        commentary: [Comment!]
        matchStats: MatchStats
        playerStats: PlayerStats
    }
    
    type MatchInfo {
        stadium: String
        attendance: String
        referee: String
    }
    
    type Lineup {
        starters: [Position!]
        substitutes: [Position!]
    }
    
    type Position {
        id: String!
        number: Int
        name: String!
        pos: String!
    }
    
    type Substitutions {
        homeTeam: [Substitution!]!
        awayTeam: [Substitution!]!
    }
    
    type Substitution {
        offName: String!
        onName: String!
        offId: String!
        onId: String!
        minute: Int!
        extraMin: Int
    }
    
    type Comment {
        id: String!
        important: Boolean!
        goal: Boolean!
        minute: Int!
        extraMin: Int
        comment: String!
    }
    
    type MatchStats {
        homeTeam: TeamStats!
        awayTeam: TeamStats!
    }
    
    type TeamStats {
        shotsTotal: Int!
        shotsOnGoal: Int!
        fouls: Int!
        corners: Int!
        offsides: Int!
        possessionPercentage: String!
        yellowCards: Int!
        redCards: Int!
        saves: Int!
    }
    
    type PlayerStats {
        homeTeam: [Player!]
        awayTeam: [Player!]
    }
    
    type Player {
        id: String!
        num: Int
        name: String!
        pos: String
        posX: String
        posY: String
        shotsTotal: Int!
        shotsOnGoal: Int!
        goals: Int!
        assists: Int!
        offsides: Int!
        foulsDrawn: Int!
        foulsCommitted: Int!
        saves: Int!
        yellowCards: Int!
        redCards: Int!
        penaltyScore: Int!
        penaltyMiss: Int!
    }

    input PredictionInput {
        matchId: String!
        hGoals: Int!
        aGoals: Int!
    }
    
    type Prediction {
        matchId: String!
        hGoals: Int!
        aGoals: Int!
    }
    
    type MatchPredictionSummary {
        homeWin: Int!
        draw: Int!
        awayWin: Int!
    }
    
    type User {
        id: String!
        firstName: String!
        surname: String!
        email: String!
        predictedWinner: String!
        score: Int!
    }
    
    input UpdateUserInfoInput {
        firstName: String!
        surname: String!
        email: String!
    }
    
    input UpdatePasswordInput {
        oldPassword: String!
        newPassword: String!
        confirmPassword: String!
    }

    scalar Date
    scalar DateTime
    
    type Query {
        # live match service
        liveMatch(matchId: String!): LiveMatch!
        upcomingMatches: [UpcomingMatchday!]!
        todaysLiveMatches: [LiveMatch!]!
    
        # prediction service
        predictionSummary(matchId: String!): MatchPredictionSummary!
        prediction(matchId: String!): Prediction!
        pastPredictionsForUser(userId: String!): [Prediction!]!
        predictions: [Prediction!]!
    
        # fixture service
        fixture(fixtureId: String!): Fixture!
        fixtures: [Fixture!]!
        forms: [TeamForm!]!
        futureFixtures: [Fixture!]!
    
        # league service
        leagueTable(pin: String!): [LeagueUser!]!
        overallLeagueTable: [LeagueUser!]!
        leagueOverview: LeagueOverview!
    
        # user service
        user: User!
    }
    
    type Mutation {
        # auth service
        login(email: String!, password: String!): AuthResponse!
        register(req: RegisterInput!): AuthResponse!
        initiatePasswordReset(email: String!): String!
        resetPassword(req: PasswordResetInput!): AuthResponse!
    
        # league service
        addLeague(name: String!): League!
        joinLeague(pin: String!): League!
        leaveLeague(pin: String!): LeagueOverview!
        renameLeague(pin: String!, name: String!): League!
    
        # prediction service
        updatePredictions(predictions: [PredictionInput!]): [Prediction!]!
    
        # user
        updateUserInfo(req: UpdateUserInfoInput!): User!
        updatePassword(req: UpdatePasswordInput!): User!
    }
    
    schema {
        query: Query
        mutation: Mutation
    }
`
